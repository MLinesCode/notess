interface NoteCardProps {
  content: string;
}

export default function NoteCard({ content }: NoteCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-gray-800 text-sm leading-relaxed">{content}</p>
    </div>
  );
}
