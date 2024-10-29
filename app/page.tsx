'use client';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('./components/HTMLEditor'), { ssr: false });
export default function Home() {
  return (
    <main className='w-full h-screen p-8'>
      <Editor initialHTML={'<p>Ciao</p>'} />
    </main>
  );
}
