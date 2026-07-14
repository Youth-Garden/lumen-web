import { useState } from 'react';
import { useGetMissingExplanations } from '../hooks/use-toeic';
import { ToeicExplanationEditor } from '../components/toeic-explanation-editor';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

interface MissingExplanationDto {
  id: string;
  questionNumber: number;
  questionText: string;
  part: number;
  testTitle: string;
  testId: string;
}

const MissingExplanationsPage = () => {
  const {
    data: missingExplanations = [],
    isLoading,
    refetch,
  } = useGetMissingExplanations();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Icons
          name="loader-2"
          className="h-8 w-8 animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  if (selectedQuestionId) {
    return (
      <div className="py-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedQuestionId(null)}
          className="mb-4"
        >
          <Icons name="arrow-left" className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <ToeicExplanationEditor
          questionId={selectedQuestionId}
          onClose={() => setSelectedQuestionId(null)}
          onSuccess={() => {
            setSelectedQuestionId(null);
            refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Quality Control Dashboard
        </h2>
        <p className="text-muted-foreground">
          Manage explanations for TOEIC questions.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">
            Missing Explanations ({missingExplanations.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            Questions that require your attention to add explanations.
          </p>
        </div>

        <div className="p-6 pt-0">
          {missingExplanations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icons
                name="check-circle"
                className="h-12 w-12 mx-auto mb-3 text-green-500"
              />
              <p>All caught up! No questions are missing explanations.</p>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                      Test
                    </th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                      Part
                    </th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                      No.
                    </th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                      Question Text
                    </th>
                    <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {missingExplanations.map(
                    (question: MissingExplanationDto) => (
                      <tr
                        key={question.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle font-medium">
                          {question.testTitle}
                        </td>
                        <td className="p-4 align-middle">
                          Part {question.part}
                        </td>
                        <td className="p-4 align-middle">
                          #{question.questionNumber}
                        </td>
                        <td className="p-4 align-middle max-w-[300px] truncate">
                          {question.questionText || (
                            <span className="text-muted-foreground italic">
                              Listening Question (Audio only)
                            </span>
                          )}
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Button
                            size="sm"
                            onClick={() => setSelectedQuestionId(question.id)}
                          >
                            <Icons name="edit" className="h-3.5 w-3.5 mr-1.5" />
                            Add Explanation
                          </Button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissingExplanationsPage;
