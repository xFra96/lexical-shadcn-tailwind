import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ViewColumnsIcon } from '@heroicons/react/20/solid';
import { LexicalEditor } from 'lexical';
import { INSERT_LAYOUT_COMMAND } from '../../LayoutPlugin';
import LAYOUTS from '../../../config/layoutsPluginConfig';
export default function LayoutDialog({ editor }: { editor: LexicalEditor }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' title='Aggiungi layout a colonne' aria-label='Aggiungi layout a colonne'>
          <ViewColumnsIcon className='h5 w-5' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Inserisci layout a colonne</DialogTitle>
          <DialogDescription>
            Seleziona la struttura che più sia datta alle tue esigenze, sarà creato nel documento un layout a colonne in
            modo da poter organizzare il testo in modo più chiaro.
          </DialogDescription>
        </DialogHeader>
        <div className='py-1 flex flex-col gap-4'>
          {LAYOUTS.map(({ label, value }) => {
            return (
              <DialogTrigger key={value} asChild>
                <Button
                  variant='outline'
                  onClick={(e) => {
                    e.preventDefault();
                    editor.dispatchCommand(INSERT_LAYOUT_COMMAND, value);
                  }}
                >
                  {label}
                </Button>
              </DialogTrigger>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
