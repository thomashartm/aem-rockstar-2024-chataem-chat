import Image from 'next/image';

type BotAvatarProps = Readonly<{
  botName: string;
  icon: string;
}>;


export default function BotAvatar(props: BotAvatarProps) {
  return (
    <Image
      unoptimized={true}
      alt={props.botName}
      height={32}
      src={props.icon}
      width={30}
    />
  );
}
