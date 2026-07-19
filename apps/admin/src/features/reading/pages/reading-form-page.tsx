import { RouteEnum } from '@/shared/constants/route';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export default function ReadingFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(RouteEnum.READING)}
            className="p-2 h-8 w-8"
          >
            <Icons name="arrow-left" className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Edit' : 'Create'} Reading
          </h2>
        </div>
        <Button onClick={() => navigate(RouteEnum.READING)}>
          <Icons name="save" className="mr-2 h-4 w-4" /> Save
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="Enter title" />
          </div>
          <div className="space-y-2 pt-4">
            <p className="text-sm text-muted-foreground text-center italic">
              Form fields to be implemented in a future iteration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
