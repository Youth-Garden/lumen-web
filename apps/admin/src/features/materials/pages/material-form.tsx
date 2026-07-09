import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@lumen/uikit/components"
import { RichTextEditor } from "@/shared/components/rich-text-editor"
import { Icons } from '@lumen/uikit/icons';
import { useMaterialDetail, useCreateMaterial, useUpdateMaterial } from "../hooks"
import { RouteEnum } from "@/shared/constants"

export default function MaterialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const { data: materialResponse, isLoading } = useMaterialDetail(id!, { enabled: isEditing })
  const material = materialResponse?.data

  const createMutation = useCreateMaterial()
  const updateMutation = useUpdateMaterial()
  const isPending = createMutation.isPending || updateMutation.isPending

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<"Reading" | "Listening">("Reading")
  const [level, setLevel] = useState("Beginner")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")

  useEffect(() => {
    if (isEditing && material) {
      setTitle(material.title || "")
      setCategory((material.category as "Reading" | "Listening") || "Reading")
      setLevel(material.level || "Beginner")
      setContent(material.content || "")
      setTags((material.tags || []).join(", "))
    }
  }, [isEditing, material])

  const handleSave = () => {
    const payload = {
      title,
      category,
      level: level as any,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean)
    }

    if (isEditing && id) {
      updateMutation.mutate({ id, payload }, {
        onSuccess: () => navigate(RouteEnum.MATERIALS)
      })
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => navigate(RouteEnum.MATERIALS)
      })
    }
  }

  if (isEditing && isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons name="loader-2" className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(RouteEnum.MATERIALS)} className="p-2 h-8 w-8">
            <Icons name="arrow-left" className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Edit Material" : "Create New Material"}
          </h2>
        </div>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? <Icons name="loader-2" className="mr-2 h-4 w-4 animate-spin" /> : <Icons name="save" className="mr-2 h-4 w-4" />}
          Save Material
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Business Meeting Phrases"
                />
              </div>

              <div className="space-y-2">
                <Label>Material Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  {(["Reading", "Listening"] as const).map((typeOption) => (
                    <button
                      key={typeOption}
                      type="button"
                      onClick={() => setCategory(typeOption)}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-colors cursor-pointer ${
                        category === typeOption
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-border bg-white dark:bg-slate-900"
                      }`}
                    >
                      {typeOption === "Reading"
                        ? <Icons name="book-open" className={`h-5 w-5 ${category === typeOption ? "text-indigo-600" : "text-muted-foreground"}`} />
                        : <Icons name="headphones" className={`h-5 w-5 ${category === typeOption ? "text-indigo-600" : "text-muted-foreground"}`} />
                      }
                      <div className="text-left">
                        <p className="font-medium text-sm">{typeOption}</p>
                        <p className="text-xs text-muted-foreground">{typeOption === "Reading" ? "Text passage" : "Audio exercise"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {category === "Listening" && (
                <div className="space-y-2">
                  <Label>Audio File</Label>
                  <div className="flex gap-4 items-center p-4 border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Icons name="headphones" className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Upload Audio File</p>
                      <p className="text-xs text-muted-foreground">MP3, WAV supported (max 50MB)</p>
                    </div>
                    <Button variant="secondary">
                      <Icons name="upload" className="h-4 w-4 mr-2" /> Browse
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Content Body</Label>
                <RichTextEditor value={content} onChange={setContent} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="level">Difficulty Level</Label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. business, travel"
                />
                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900 gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <Icons name="upload" className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground text-center">Click to upload or drag and drop</p>
                <Button variant="secondary" size="sm">Browse Image</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
