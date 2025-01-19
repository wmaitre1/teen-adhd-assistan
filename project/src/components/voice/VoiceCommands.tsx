import React, { useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { navigationCommands } from "../../lib/voice/navigationCommands";
import { VOICE_COMMANDS } from "../../lib/constants";

interface VoiceCommandsProps {
  onClose: () => void;
}

interface Command {
  description: string;
  examples?: string[];
}

interface CommandCategory {
  title: string;
  commands: Command[];
}

// Reusable component for rendering a single command
const CommandItem = ({ description, examples }: Command) => (
  <div className="flex items-start space-x-2">
    <span className="text-primary">•</span>
    <div>
      <p className="font-medium text-gray-800">{description}</p>
      {examples && (
        <p className="text-sm text-gray-600">Example: {examples.join(", ")}</p>
      )}
    </div>
  </div>
);

// Reusable component for rendering a command section
const CommandSection = ({ title, commands }: CommandCategory) => (
  <section>
    <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
    <div className="space-y-2 text-gray-600">
      {commands.map((command, index) => (
        <CommandItem
          key={index}
          description={command.description}
          examples={command.examples}
        />
      ))}
    </div>
  </section>
);

export function VoiceCommands({ onClose }: VoiceCommandsProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Define all command categories dynamically
  const commandCategories: CommandCategory[] = [
    {
      title: "Navigation",
      commands: Object.entries(navigationCommands).map(([key, command]) => ({
        description: `"Go to ${command.routeName.toLowerCase()}"`,
        examples: command.aliases.map((alias) => `"${alias}"`),
      })),
    },
    {
      title: "Tasks",
      commands: [
        {
          description: `"${VOICE_COMMANDS.TASKS.ADD} [task name]"`,
          examples: ["add task complete math homework"],
        },
        {
          description: `"${VOICE_COMMANDS.TASKS.COMPLETE} [task name]"`,
          examples: ["complete task math homework"],
        },
      ],
    },
    {
      title: "Mindfulness",
      commands: [
        {
          description: `"${VOICE_COMMANDS.MINDFULNESS.QUICK_MEDITATION}"`,
          examples: ["start quick meditation", "I want to meditate"],
        },
        {
          description: `"${VOICE_COMMANDS.MINDFULNESS.BREATHING_EXERCISE}"`,
          examples: ["start breathing exercise", "I want to do breathing"],
        },
      ],
    },
    {
      title: "Mood Check-In",
      commands: [
        {
          description: `"${VOICE_COMMANDS.MOOD.CHECK_IN}"`,
          examples: ["log my mood", "I want to check in with my mood"],
        },
      ],
    },
    {
      title: "Journal",
      commands: [
        {
          description: `"${VOICE_COMMANDS.JOURNAL.NEW_ENTRY}"`,
          examples: ["add new journal entry", "start a new journal"],
        },
        {
          description: `"${VOICE_COMMANDS.JOURNAL.PROMPT_HELP}"`,
          examples: ["I need a prompt", "get AI help for journaling"],
        },
      ],
    },
  ];

  return (
    <motion.div
      ref={tooltipRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 right-4 bg-white rounded-lg shadow-lg p-6 max-w-md w-full z-50"
      style={{ minWidth: "320px" }}
    >
      <div className="relative">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close voice commands"
          className="absolute -top-2 -right-2 p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Arrow pointing to mic button */}
        <div
          className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"
          style={{
            boxShadow: "4px 4px 8px -4px rgba(0, 0, 0, 0.1)",
            zIndex: -1,
          }}
        />

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Voice Commands
        </h2>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
          {/* Render all command categories */}
          {commandCategories.map((category, index) => (
            <CommandSection
              key={index}
              title={category.title}
              commands={category.commands}
            />
          ))}

          {/* Tip section */}
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-sm text-gray-800">
              <span className="font-medium">Tip:</span> You can use natural
              language variations of these commands. Eleanor will understand
              context and intent.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
