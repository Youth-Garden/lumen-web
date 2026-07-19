import { RouteEnum } from '@/shared/constants/route';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@lumen/uikit/components';
import { RichTextEditor } from '@/shared/components/rich-text-editor';
import { Icons } from '@lumen/uikit/icons';
import {
  useToeicTestDetail,
  useCreateToeicTest,
  useUpdateToeicTest,
} from '../hooks';

export default function TestFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const { data: testResponse, isLoading } = useToeicTestDetail(id as string, {
    enabled: isEditing,
  });
  const test = testResponse?.data;

  const createMutation = useCreateToeicTest();
  const updateMutation = useUpdateToeicTest();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activePart, setActivePart] = useState('1');

  // Questions state management
  const [questions, setQuestions] = useState([
    {
      id: 1,
      part: '1',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      audioUrl: null,
      imageUrl: null,
    },
  ]);

  useEffect(() => {
    if (isEditing && test) {
      setTitle(test.title || '');
      setDescription(test.description || '');
      if (test.questions && test.questions.length > 0) {
        // Simple mapping for demo
        setQuestions(
          test.questions.map((question: any) => ({
            id: question.id || Date.now(),
            part: String(question.part),
            text: question.questionText || '',
            options: question.options || ['', '', '', ''],
            correctAnswer: question.correctAnswer || 0,
            audioUrl: question.audioUrl || null,
            imageUrl: question.imageUrl || null,
          })),
        );
      }
    }
  }, [isEditing, test]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        part: activePart,
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        audioUrl: null,
        imageUrl: null,
      },
    ]);
  };

  const handleSave = () => {
    const payload = {
      title,
      description,
      durationMinutes: 120, // Default for now
      questions: questions.map((question) => ({
        part: Number(question.part),
        questionText: question.text,
        options: question.options,
        correctAnswer: question.correctAnswer,
        audioUrl: question.audioUrl,
        imageUrl: question.imageUrl,
      })),
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: id as string, payload },
        {
          onSuccess: () => navigate(RouteEnum.TOEIC),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => navigate(RouteEnum.TOEIC),
      });
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons
          name="loader-2"
          className="h-8 w-8 animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(RouteEnum.TOEIC)}
            className="p-2 h-8 w-8"
          >
            <Icons name="arrow-left" className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Edit Test' : 'Create New Test'}
          </h2>
        </div>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? (
            <Icons name="loader-2" className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons name="save" className="mr-2 h-4 w-4" />
          )}{' '}
          Save
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Test Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ETS 2024 Test 1"
                />
              </div>

              <div className="space-y-2">
                <Label>Description / Instructions</Label>
                <RichTextEditor value={description} onChange={setDescription} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Test Parts Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activePart}
                onValueChange={setActivePart}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-7 mb-4">
                  <TabsTrigger value="1">Part 1</TabsTrigger>
                  <TabsTrigger value="2">Part 2</TabsTrigger>
                  <TabsTrigger value="3">Part 3</TabsTrigger>
                  <TabsTrigger value="4">Part 4</TabsTrigger>
                  <TabsTrigger value="5">Part 5</TabsTrigger>
                  <TabsTrigger value="6">Part 6</TabsTrigger>
                  <TabsTrigger value="7">Part 7</TabsTrigger>
                </TabsList>

                <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900 min-h-[300px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">
                      Questions for Part {activePart}
                    </h3>
                    <Button variant="outline" size="sm" onClick={addQuestion}>
                      <Icons name="plus" className="h-4 w-4 mr-2" /> Add
                      Question
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {questions.filter(
                      (question) => question.part === activePart,
                    ).length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        No questions added to this part yet.
                      </div>
                    ) : (
                      questions
                        .filter((question) => question.part === activePart)
                        .map((question, index) => (
                          <Card key={question.id} className="p-4 relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                setQuestions(
                                  questions.filter(
                                    (item) => item.id !== question.id,
                                  ),
                                )
                              }
                            >
                              <Icons name="trash-2" className="h-4 w-4" />
                            </Button>

                            <div className="space-y-4 pt-2">
                              <div className="flex gap-4">
                                <div className="font-bold w-8 shrink-0">
                                  Q{index + 1}.
                                </div>
                                <div className="flex-1 space-y-4">
                                  {/* Question Text */}
                                  <div className="space-y-2">
                                    <Label>Question Text</Label>
                                    <Input placeholder="Enter question..." />
                                  </div>

                                  {/* Media Uploads (Audio/Image) */}
                                  {(activePart === '1' ||
                                    activePart === '2' ||
                                    activePart === '3' ||
                                    activePart === '4') && (
                                    <div className="flex gap-4 items-center p-3 border border-dashed rounded-md bg-white dark:bg-slate-950">
                                      <Icons
                                        name="upload"
                                        className="h-4 w-4 text-muted-foreground"
                                      />
                                      <span className="text-sm text-muted-foreground">
                                        Upload Audio (.mp3)
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="ml-auto"
                                      >
                                        Browse
                                      </Button>
                                    </div>
                                  )}

                                  {activePart === '1' && (
                                    <div className="flex gap-4 items-center p-3 border border-dashed rounded-md bg-white dark:bg-slate-950">
                                      <Icons
                                        name="upload"
                                        className="h-4 w-4 text-muted-foreground"
                                      />
                                      <span className="text-sm text-muted-foreground">
                                        Upload Image (.jpg, .png)
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="ml-auto"
                                      >
                                        Browse
                                      </Button>
                                    </div>
                                  )}

                                  {/* Options */}
                                  <div className="space-y-2 pt-2">
                                    <Label>Options</Label>
                                    {['A', 'B', 'C', 'D'].map((opt) => (
                                      <div
                                        key={opt}
                                        className="flex items-center gap-2"
                                      >
                                        <div className="w-6 text-center font-medium">
                                          {opt}.
                                        </div>
                                        <Input placeholder={`Option ${opt}`} />
                                        <input
                                          type="radio"
                                          name={`correct-${question.id}`}
                                          className="ml-2 w-4 h-4 cursor-pointer"
                                          title="Mark as correct answer"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))
                    )}
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" type="number" defaultValue={120} />
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
        </div>
      </div>
    </div>
  );
}
