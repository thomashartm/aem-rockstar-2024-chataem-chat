import Image from 'next/image';

const questions = [
  'How can I create a new page in AEM?',
  'Create a detailed step by step list about the process of publishing a page.',
  'Explain me the process of uploading an asset?',
];

type InfoCardProps = Readonly<{
  icon: string;
  onSetInput: (input: string) => void;
}>;

export default function InfoCard({ icon, onSetInput }: InfoCardProps) {
  return (
    <>
      <Image
        unoptimized={true}
        alt="ChatAEM"
        height={36}
        src={icon}
        width={30}
      />
      <h1 className="font-bold text-gray-700 md:text-xl">
       ChatAEM
      </h1>
      <p className="text-sm text-gray-700">🤝 This chat bot answers question around the Adobe AEM Stack
        Documentation.
      </p>
      {questions.map((question, index) => (
        <p key={index} className="text-sm text-gray-700">
          <button onClick={() => onSetInput(question)}>👇</button>
          Try asking e.g. &quot;{question}&quot;
        </p>
      ))}
    </>
  );
}
