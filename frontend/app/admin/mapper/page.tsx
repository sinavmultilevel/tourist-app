"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Square, Save, Trash2, MapPin, Footprints } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/lib/api";

interface Place {
    id: number;
    name: string;
    boundary_points?: { lat: number, lng: number }[];
    short_desc?: string;
    description?: string;
    parent_id?: number | null;
}

export default function LocationMapperPage() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [placeName, setPlaceName] = useState("");
    const [description, setDescription] = useState("");

    const [parentName, setParentName] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordedPoints, setRecordedPoints] = useState<{ lat: number, lng: number }[]>([]);
    const [status, setStatus] = useState("");
    const watchIdRef = useRef<number | null>(null);
    const systemInfoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchPlaces();
    }, []);

    // Effect to sync details when Place Name matches an existing place
    useEffect(() => {
        if (!placeName) return;

        const matchedPlace = places.find(p => p.name.toLowerCase() === placeName.toLowerCase());
        if (matchedPlace) {
            setDescription(matchedPlace.short_desc || matchedPlace.description || "");

            // Sync Parent if not already compatible or to ensure correctness
            // But be careful not to override if user is intentionally changing it?
            // Usually, if we load an existing place, we show its current parent.
            if (matchedPlace.parent_id) {
                const parent = places.find(p => p.id === matchedPlace.parent_id);
                if (parent) setParentName(parent.name);
            } else {
                // It's a top level place, or user wants to make it top level? 
                // If we load an existing place, we should reflect its state.
                // UNLESS parentName is being used as a filter?
                // If I filtered by "Parent A", list shows "Child B". I click "Child B". 
                // "Child B" has parent "Parent A". parentName is already "Parent A". Matches.
                // If I type "TopLevel C", parent_id is null. parentName should probably be cleared?
                // Let's only force set if it has a parent. If it doesn't, clearing parentName might close the filter view, which might be jarring.
                // BUT, consistency requires showing the truth.
                // Let's decide: "Parent Place" field is dual purpose: Filter AND Assign.
                // So if I load "TopLevel C", Parent Field should be empty.
                // EXCEPT if I am just *creating* a new child. 
                // Case: I typed "ExistingPlace". I want to edit it. It has no parent. Parent field should be empty.
                if (!parentName) {
                    // If filter was empty, keep it empty.
                    // If filter was set, and this place has NO parent, should we clear?
                    // If I am in "Parent A" view, I only see children of A. 
                    // If I type name of "Place D" (unrelated), it won't be in suggestions (filtered).
                    // But if I typed it manually?
                    // Let's stick to: if place has parent, set it. if not, only clear if currently set to something that confuses.
                    // Actually, safest is: if matchedPlace has parent, set it. 
                }
            }

            if (matchedPlace.boundary_points) {
                setRecordedPoints(matchedPlace.boundary_points);
                setStatus(`Loaded details for ${matchedPlace.name}`);
            } else {
                setRecordedPoints([]); // Or keep existing if just editing desc? No, safest to reflect DB.
                setStatus(`Loaded details for ${matchedPlace.name} (No path)`);
            }
        }
    }, [placeName, places]);

    const fetchPlaces = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            // Request all places including children for the mapper
            const res = await fetch(`${API_URL}/admin/places?limit=1000&include_children=true`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPlaces(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = () => {
        if (!navigator.geolocation) {
            setStatus("Geolocation is not supported by your browser");
            return;
        }

        setIsRecording(true);
        setStatus("Recording path... Walk around the area.");
        setRecordedPoints([]); // Start fresh or append? Let's start fresh for now.

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const newPoint = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setRecordedPoints(prev => [...prev, newPoint]);
            },
            (error) => {
                console.error(error);
                setStatus("Error getting location: " + error.message);
                setIsRecording(false);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 30000
            }
        );
    };

    const stopRecording = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsRecording(false);
        setStatus(`Recording stopped. Captured ${recordedPoints.length} points.`);
    };

    const saveBoundary = async () => {
        console.log("Saving...", { placeName, points: recordedPoints.length });

        if (!placeName.trim()) {
            setStatus("Please enter a name.");
            return;
        }

        try {
            setStatus("Saving...");
            const token = localStorage.getItem("admin_token");

            // Resolve Parent ID from Name
            const parentPlace = places.find(p => p.name.toLowerCase() === parentName.trim().toLowerCase());
            const resolvedParentId = parentPlace ? parentPlace.id : null;

            // 1. Check if place exists
            const existingPlace = places.find(p => p.name.toLowerCase() === placeName.trim().toLowerCase());

            if (existingPlace) {
                // UPDATE user existing ID
                const res = await fetch(`${API_URL}/admin/places/${existingPlace.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        boundary_points: recordedPoints,
                        short_desc: description,
                        description: description,
                        parent_id: resolvedParentId
                    })
                });

                if (res.ok) {
                    setStatus(`Successfully updated boundary for '${existingPlace.name}'!`);
                    fetchPlaces();
                } else {
                    setStatus("Failed to update boundary.");
                }
            } else {
                // CREATE NEW PLACE
                // Use the first recorded point as the center/marker
                const centerLat = recordedPoints[0].lat;
                const centerLng = recordedPoints[0].lng;

                const res = await fetch(`${API_URL}/admin/places`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: placeName.trim(),
                        type: "historical",
                        latitude: centerLat,
                        longitude: centerLng,
                        boundary_points: recordedPoints,
                        short_desc: description || "Auto-created by Location Mapper",
                        description: description || "",
                        parent_id: resolvedParentId,
                        long_desc: "",
                        is_active: true
                    })
                });

                if (res.ok) {
                    setStatus(`Created NEW place '${placeName}' with boundary!`);
                    fetchPlaces();
                } else {
                    const errData = await res.json();
                    setStatus("Failed to create place: " + JSON.stringify(errData));
                }
            }
        } catch (err) {
            setStatus("Error saving: " + err);
        }
    };

    const deletePlace = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete '${name}'? This action cannot be undone.`)) return;

        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`${API_URL}/admin/places/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setStatus(`Deleted '${name}'.`);
                // Clear selection if deleted
                if (placeName === name) {
                    setPlaceName("");
                    setDescription("");
                    setRecordedPoints([]);
                    setParentName("");
                }
                fetchPlaces();
            } else {
                setStatus("Failed to delete place.");
            }
        } catch (err) {
            setStatus("Error deleting: " + err);
        }
    };

    // Calculate a simple SVG path for preview
    const getSvgPath = () => {
        if (recordedPoints.length < 2) return "";

        // Normalize points to fit in 100x100 box
        const lats = recordedPoints.map(p => p.lat);
        const lngs = recordedPoints.map(p => p.lng);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        // Avoid division by zero
        const latRange = maxLat - minLat || 0.0001;
        const lngRange = maxLng - minLng || 0.0001;

        const pathData = recordedPoints.map((p, i) => {
            // Map lat/lng to 0-100 coordinates
            // Invert Lat y-axis because screen coords go down
            const x = ((p.lng - minLng) / lngRange) * 100;
            const y = 100 - ((p.lat - minLat) / latRange) * 100;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(" ");

        return pathData + " Z"; // Close path
    };

    // Derived state for filtering
    const selectedParent = parentName ? places.find(p => p.name.toLowerCase() === parentName.toLowerCase()) : null;
    const filteredPlaces = selectedParent
        ? places.filter(p => p.parent_id === selectedParent.id)
        : places;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Footprints className="text-primary" /> Location Mapper
                </h1>
                <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border">
                    {status || "Ready"}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="p-6 bg-white shadow-sm border border-slate-200">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Parent Place (Filter / Assign)</label>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg bg-slate-50 pl-9 text-sm"
                                placeholder="Search parent place to filter..."
                                value={parentName}
                                onChange={(e) => setParentName(e.target.value)}
                                list="parent-places-list"
                            />
                            <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                            <datalist id="parent-places-list">
                                {places.filter(p => !p.parent_id && p.name !== placeName).map(p => (
                                    <option key={p.id} value={p.name} />
                                ))}
                            </datalist>
                        </div>

                        <label className="block text-sm font-bold text-slate-700 mb-2">Place Name</label>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg bg-slate-50 pl-9"
                                placeholder="Enter place name (e.g. Harem)"
                                value={placeName}
                                onChange={(e) => setPlaceName(e.target.value)}
                                list="places-list"
                            />
                            <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                            <datalist id="places-list">
                                {filteredPlaces.map(p => (
                                    <option key={p.id} value={p.name} />
                                ))}
                            </datalist>
                        </div>

                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                        <textarea
                            className="w-full p-2 border rounded-lg bg-slate-50 mb-4 text-sm"
                            rows={3}
                            placeholder="Enter a short description about this place..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className="flex flex-col gap-3">
                            {!isRecording ? (
                                <Button
                                    onClick={startRecording}
                                    disabled={!placeName}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <Play size={16} className="mr-2" /> Start Recording Path
                                </Button>
                            ) : (
                                <Button
                                    onClick={stopRecording}
                                    className="w-full bg-rose-600 hover:bg-rose-700 animate-pulse"
                                >
                                    <Square size={16} className="mr-2" /> Stop Recording
                                </Button>
                            )}

                            <Button
                                onClick={() => {
                                    console.log("Save clicked");
                                    saveBoundary();
                                }}
                                disabled={isRecording || (recordedPoints.length === 0 && !placeName)}
                                variant="outline"
                            >
                                <Save size={16} className="mr-2" /> Save
                            </Button>

                            <Button
                                onClick={() => setRecordedPoints([])}
                                disabled={isRecording || recordedPoints.length === 0}
                                variant="ghost"
                                className="text-red-500 hover:text-red-600"
                            >
                                <Trash2 size={16} className="mr-2" /> Clear Points
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-4 bg-slate-50 border border-slate-200">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Stats</h3>
                        <div className="text-sm">
                            <p>Points: <strong>{recordedPoints.length}</strong></p>
                            <p>Status: <span className={isRecording ? "text-green-600 font-bold" : "text-slate-600"}>{isRecording ? "Active" : "Idle"}</span></p>
                        </div>
                    </Card>

                    <Card className="flex-1 min-h-[200px] bg-white border border-slate-200 flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-sm">
                                {selectedParent ? `Children of ${selectedParent.name}` : `Registered Places`}
                                ({filteredPlaces.length})
                            </h3>
                            {parentName && (
                                <button
                                    onClick={() => setParentName("")}
                                    className="text-xs text-primary hover:underline"
                                >
                                    Show All
                                </button>
                            )}
                        </div>
                        <div className="overflow-y-auto max-h-[300px] p-2 space-y-1">
                            {filteredPlaces.length === 0 && <p className="text-xs text-slate-400 p-2">No places found.</p>}
                            {filteredPlaces.map(p => (
                                <div
                                    key={p.id}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors group ${placeName.toLowerCase() === p.name.toLowerCase()
                                        ? "bg-primary-50 text-primary-700 font-medium"
                                        : "hover:bg-slate-50 text-slate-600"
                                        }`}
                                >
                                    <button
                                        onClick={() => {
                                            setPlaceName(p.name);
                                            setDescription(p.short_desc || p.description || "");
                                            // Find parent name
                                            if (p.parent_id) {
                                                const parent = places.find(pl => pl.id === p.parent_id);
                                                setParentName(parent ? parent.name : "");
                                            } else {
                                                setParentName("");
                                            }

                                            // Optional: Load points immediately on click if desired
                                            if (p.boundary_points) {
                                                setRecordedPoints(p.boundary_points);
                                                setStatus(`Loaded boundary for ${p.name}`);
                                            } else {
                                                setRecordedPoints([]);
                                                setStatus(`Selected ${p.name}`);
                                            }
                                        }}
                                        className="flex-1 text-left flex items-center justify-between"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">{p.name}</span>
                                            {p.parent_id && (
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    ↳ Sub-location of {places.find(pl => pl.id === p.parent_id)?.name || "Unknown"}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {p.boundary_points && (
                                                <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full">
                                                    Mapped
                                                </span>
                                            )}
                                        </div>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deletePlace(p.id, p.name);
                                        }}
                                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete Place"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-2">
                    <Card className="h-[400px] bg-white p-4 items-center justify-center flex relative overflow-hidden border border-slate-200">
                        {recordedPoints.length > 2 ? (
                            <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] overflow-visible">
                                <path
                                    d={getSvgPath()}
                                    fill="rgba(59, 130, 246, 0.2)"
                                    stroke="#2563EB"
                                    strokeWidth="1"
                                />
                                {recordedPoints.map((p, i) => {
                                    // Re-calculate for points (inefficient but fine for demo)
                                    // In real app, memoize bounds
                                    const lats = recordedPoints.map(p => p.lat);
                                    const lngs = recordedPoints.map(p => p.lng);
                                    const minLat = Math.min(...lats); const maxLat = Math.max(...lats);
                                    const minLng = Math.min(...lngs); const maxLng = Math.max(...lngs);
                                    const latRange = maxLat - minLat || 0.0001;
                                    const lngRange = maxLng - minLng || 0.0001;
                                    const x = ((p.lng - minLng) / lngRange) * 100;
                                    const y = 100 - ((p.lat - minLat) / latRange) * 100;
                                    return (
                                        <circle cx={x} cy={y} r="1.5" fill={i === recordedPoints.length - 1 ? "red" : "#2563EB"} key={i} />
                                    );
                                })}
                            </svg>
                        ) : (
                            <div className="text-center text-slate-400">
                                <MapPin size={48} className="mx-auto mb-2 opacity-20" />
                                <p>Path preview will appear here</p>
                            </div>
                        )}

                        <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-mono">
                            {recordedPoints.length > 0 && `Last: ${recordedPoints[recordedPoints.length - 1].lat.toFixed(6)}, ${recordedPoints[recordedPoints.length - 1].lng.toFixed(6)}`}
                        </div>
                    </Card>

                    {/* Simple Data Table */}
                    <div className="mt-4 max-h-48 overflow-y-auto border rounded-lg bg-white">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0">
                                <tr>
                                    <th className="p-2">#</th>
                                    <th className="p-2">Latitude</th>
                                    <th className="p-2">Longitude</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recordedPoints.map((p, i) => (
                                    <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                                        <td className="p-2 text-slate-400">{i + 1}</td>
                                        <td className="p-2 font-mono">{p.lat.toFixed(7)}</td>
                                        <td className="p-2 font-mono">{p.lng.toFixed(7)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
