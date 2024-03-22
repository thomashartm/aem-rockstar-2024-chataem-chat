import ChatAEM from '../components/ChatAEM';
import {cookies} from 'next/headers';

/**
 * Alternative staff configs are used in the demo. Only for playing around a bit.
 */
function pickSupportStaffAvatar() {
  const standard = {icon: '/static/emoji/chataem-logo.webp', botName: 'ChatAEM'};
  const helga = {icon: '/static/emoji/ask-helga.webp', botName: 'Helga'};
  const bruno = {icon: '/static/emoji/pirate-parrot-icon.webp', botName: 'Bruno'}; // This can be any other element

  if (process.env.EASTER_EGG === 'true') {
    const randomNumber = Math.random();
    return randomNumber < 0.8 ? bruno : helga;
  }
  return standard;
}

export default function Home() {
  const staff = pickSupportStaffAvatar();
  return (
    <ChatAEM
      botName={staff.botName}
      icon={staff.icon}
      endpoint="/api/aemchat"
    />
  );
}
