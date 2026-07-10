import { useNavigate } from 'react-router-dom';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export default function ListeningSpeakingList() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            ListeningSpeaking Management
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage listening speaking
          </p>
        </div>
        <Button onClick={() => navigate('/listening-speaking/new')}>
          <Icons name="plus" className="mr-2 h-4 w-4" /> Add ListeningSpeaking
        </Button>
      </div>
      <div className="bg-white dark:bg-slate-900 border rounded-lg p-16 text-center text-muted-foreground flex flex-col items-center justify-center">
        <Icons
          name="layers"
          className="h-12 w-12 mb-4 opacity-30 text-teal-500"
        />
        <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
          No listening speaking found
        </p>
        <p className="text-sm mt-1 mb-6">
          Click "Add" to create the first entry.
        </p>
      </div>
    </div>
  );
}
