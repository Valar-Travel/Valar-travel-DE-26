"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2, Plus, MoveUp, MoveDown, ImageIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface PhotoManagerProps {
  propertyId: string
  propertyName: string
  images: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function PhotoManager({ propertyId, propertyName, images, open, onOpenChange, onUpdate }: PhotoManagerProps) {
  const [photos, setPhotos] = useState<string[]>(images || [])
  const [isSaving, setIsSaving] = useState(false)
  const [newPhotoUrl, setNewPhotoUrl] = useState("")
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const handleDeletePhoto = (index: number) => {
    setDeleteIndex(index)
  }

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const newPhotos = photos.filter((_, i) => i !== deleteIndex)
      setPhotos(newPhotos)
      setHasChanges(true)
      setDeleteIndex(null)
    }
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newPhotos = [...photos]
    ;[newPhotos[index - 1], newPhotos[index]] = [newPhotos[index], newPhotos[index - 1]]
    setPhotos(newPhotos)
    setHasChanges(true)
  }

  const handleMoveDown = (index: number) => {
    if (index === photos.length - 1) return
    const newPhotos = [...photos]
    ;[newPhotos[index], newPhotos[index + 1]] = [newPhotos[index + 1], newPhotos[index]]
    setPhotos(newPhotos)
    setHasChanges(true)
  }

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) {
      toast.error("Please enter a photo URL")
      return
    }

    if (!newPhotoUrl.startsWith("http://") && !newPhotoUrl.startsWith("https://")) {
      toast.error("Please enter a valid URL starting with http:// or https://")
      return
    }

    setPhotos([...photos, newPhotoUrl.trim()])
    setNewPhotoUrl("")
    setHasChanges(true)
    toast.success("Photo added")
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": localStorage.getItem("valar_admin_auth") || "",
        },
        body: JSON.stringify({ images: photos }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save photos")
      }

      toast.success("Photos saved successfully")
      setHasChanges(false)
      onUpdate()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save photos")
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    if (hasChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to close?")) {
        setPhotos(images || [])
        setHasChanges(false)
        onOpenChange(false)
      }
    } else {
      onOpenChange(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Manage Photos - {propertyName}
            </DialogTitle>
            <DialogDescription>
              {photos.length} photos. Drag to reorder, or use the arrows. The first photo is the main image.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {/* Add New Photo */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter photo URL (https://...)"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddPhoto} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Photo
              </Button>
            </div>

            {/* Photo Grid */}
            {photos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No photos yet. Add photos using the URL input above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <Card key={`${photo}-${index}`} className="relative group overflow-hidden">
                    <div className="aspect-video relative bg-muted">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/luxury-villa.png"
                        }}
                      />

                      {/* Main Image Badge */}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                          Main Photo
                        </div>
                      )}

                      {/* Photo Number */}
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {index + 1} / {photos.length}
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === photos.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePhoto(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* URL Preview */}
                    <div className="p-2 text-xs text-muted-foreground truncate">{new URL(photo).hostname}</div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {hasChanges && <span className="text-orange-600">Unsaved changes</span>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this photo? This action will be applied when you save.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete Photo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
