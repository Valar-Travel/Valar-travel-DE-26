"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Plus, Trash2, DropletsIcon as DragHandleDots2Icon } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface Activity {
  id: string
  name: string
  type: "hotel" | "restaurant" | "attraction" | "transport"
  time: string
  duration: number
  location: string
  cost?: number
  notes?: string
}

interface DayPlan {
  date: string
  activities: Activity[]
}

interface ItineraryBuilderProps {
  tripId?: string
  destination: string
  startDate: string
  endDate: string
  onSave?: (itinerary: DayPlan[]) => void
}

export function ItineraryBuilder({ tripId, destination, startDate, endDate, onSave }: ItineraryBuilderProps) {
  const [itinerary, setItinerary] = useState<DayPlan[]>([])
  const [selectedDay, setSelectedDay] = useState(0)
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({})
  const [suggestions, setSuggestions] = useState<Activity[]>([])

  useEffect(() => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days: DayPlan[] = []

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        date: d.toISOString().split("T")[0],
        activities: [],
      })
    }

    setItinerary(days)
    loadSuggestions()
  }, [startDate, endDate])

  const loadSuggestions = async () => {
    try {
      const response = await fetch(`/api/trip-suggestions?destination=${destination}`)
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error("Failed to load suggestions:", error)
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const dayIndex = selectedDay
    const newActivities = Array.from(itinerary[dayIndex].activities)
    const [reorderedItem] = newActivities.splice(result.source.index, 1)
    newActivities.splice(result.destination.index, 0, reorderedItem)

    const newItinerary = [...itinerary]
    newItinerary[dayIndex] = {
      ...newItinerary[dayIndex],
      activities: newActivities,
    }
    setItinerary(newItinerary)
  }

  const addActivity = (activity: Partial<Activity>) => {
    const newActivityItem: Activity = {
      id: Date.now().toString(),
      name: activity.name || "",
      type: activity.type || "attraction",
      time: activity.time || "09:00",
      duration: activity.duration || 60,
      location: activity.location || destination,
      cost: activity.cost,
      notes: activity.notes,
    }

    const newItinerary = [...itinerary]
    newItinerary[selectedDay].activities.push(newActivityItem)
    setItinerary(newItinerary)
    setNewActivity({})
  }

  const removeActivity = (activityId: string) => {
    const newItinerary = [...itinerary]
    newItinerary[selectedDay].activities = newItinerary[selectedDay].activities.filter((a) => a.id !== activityId)
    setItinerary(newItinerary)
  }

  const getDayBudget = (dayIndex: number) => {
    return itinerary[dayIndex]?.activities.reduce((sum, activity) => sum + (activity.cost || 0), 0) || 0
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "hotel":
        return "🏨"
      case "restaurant":
        return "🍽️"
      case "attraction":
        return "🎯"
      case "transport":
        return "🚗"
      default:
        return "📍"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Day Selector */}
        <div className="md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Trip Days
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {itinerary.map((day, index) => (
                <Button
                  key={day.date}
                  variant={selectedDay === index ? "default" : "outline"}
                  className="w-full justify-between"
                  onClick={() => setSelectedDay(index)}
                >
                  <span>Day {index + 1}</span>
                  <Badge variant="secondary">${getDayBudget(index)}</Badge>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.slice(0, 5).map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => addActivity(suggestion)}
                >
                  <div className="flex items-center gap-2">
                    <span>{getActivityIcon(suggestion.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{suggestion.name}</p>
                      <p className="text-xs text-gray-500">{suggestion.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Itinerary */}
        <div className="md:w-3/4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Day {selectedDay + 1} - {itinerary[selectedDay]?.date}
                </span>
                <Badge variant="outline">Budget: ${getDayBudget(selectedDay)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="activities">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {itinerary[selectedDay]?.activities.map((activity, index) => (
                        <Draggable key={activity.id} draggableId={activity.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-3 p-3 border rounded-lg bg-white"
                            >
                              <div {...provided.dragHandleProps}>
                                <DragHandleDots2Icon className="h-4 w-4 text-gray-400" />
                              </div>
                              <span className="text-lg">{getActivityIcon(activity.type)}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{activity.name}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {activity.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {activity.time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {activity.location}
                                  </span>
                                  {activity.cost && <span>${activity.cost}</span>}
                                </div>
                                {activity.notes && <p className="text-sm text-gray-600 mt-1">{activity.notes}</p>}
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => removeActivity(activity.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* Add Activity Form */}
              <div className="mt-6 p-4 border-2 border-dashed border-gray-200 rounded-lg">
                <h4 className="font-medium mb-3">Add New Activity</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Activity name"
                    value={newActivity.name || ""}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  />
                  <select
                    className="px-3 py-2 border rounded-md"
                    value={newActivity.type || "attraction"}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as Activity["type"] })}
                  >
                    <option value="attraction">Attraction</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="hotel">Hotel</option>
                    <option value="transport">Transport</option>
                  </select>
                  <Input
                    type="time"
                    value={newActivity.time || "09:00"}
                    onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                  />
                  <Input
                    placeholder="Location"
                    value={newActivity.location || ""}
                    onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Cost ($)"
                    value={newActivity.cost || ""}
                    onChange={(e) => setNewActivity({ ...newActivity, cost: Number(e.target.value) })}
                  />
                  <Button
                    onClick={() => addActivity(newActivity)}
                    disabled={!newActivity.name}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <Button onClick={() => onSave?.(itinerary)} className="px-8">
              Save Itinerary
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
