import { useState, useEffect, useRef } from 'react';
import { MoodState } from '../../types';
import './AvatarMessage.css';

interface Props {
  mood: MoodState;
}

const moodMessages: Partial<Record<MoodState, string[]>> = {
  tired: [
    "Rise and shine! Let's get that protein in!",
    "*yawns* ...are we eating today or nah?",
    "I'm waiting for breakfast... just saying.",
    "Zero protein? We're better than this, bestie.",
    "Feed me and I'll be your best friend!",
  ],
  hungry: [
    "HELLO?! It's been ages since we ate!",
    "My tummy is literally singing opera rn.",
    "Protein. Now. This is not a drill.",
    "I'm getting hangry and you won't like me hangry.",
    "*stares at fridge dramatically*",
    "Is it snack time yet or do I have to beg?",
  ],
  disappointed: [
    "Bestie... we were almost there.",
    "I believe in you, but also feed me.",
    "Remember how good hitting 100% feels?",
    "A protein shake could turn this whole day around...",
    "We don't quit. We just... rest. Aggressively.",
    "Your muscles are literally crying rn.",
    "It's giving... low protein energy.",
    "Not our best day, but tomorrow's a new chance!",
  ],
  motivated: [
    "Ooh we're getting somewhere! Keep going!",
    "This is a great start, don't stop now!",
    "You've got this! I believe in us!",
    "More protein = more happy me!",
    "We're building momentum, I can feel it!",
  ],
  happy: [
    "Look at us THRIVING today!",
    "We're doing amazing, sweetie!",
    "Keep this energy going, almost there!",
    "I'm literally glowing because of you!",
    "This is what a good protein day looks like!",
  ],
  flexing: [
    "PROTEIN ROYALTY! \uD83D\uDC51",
    "We absolutely CRUSHED it today!",
    "Goals? OBLITERATED.",
    "This is what peak performance looks like!",
    "You're literally unstoppable! I'm so proud!",
    "\uD83D\uDCAA GAINS. SECURED.",
  ],
  full: [
    "Yummm, that hit the spot!",
    "Fueled up and feeling GOOD!",
    "Great pick! My tummy says thank you!",
    "Mmm delicious! More of that please!",
    "Now THAT'S what I call a meal!",
  ],
};

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function AvatarMessage({ mood }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const showMessage = () => {
    const messages = moodMessages[mood];
    if (!messages || messages.length === 0) return;

    setMessage(pickRandom(messages));
    setVisible(true);

    // Auto-hide after 6s
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 6000);
  };

  useEffect(() => {
    // Show immediately on mood change
    showMessage();

    // Then show new message every 5 minutes
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(showMessage, 5 * 60 * 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mood]);

  if (!message || !visible) return null;

  return (
    <div className="avatar-message" data-testid="avatar-message">
      <div className="avatar-message__bubble">
        {message}
      </div>
    </div>
  );
}
