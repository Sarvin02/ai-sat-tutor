import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SEED_QUESTIONS,
  summarizeSession,
  type Question,
} from "@ai-sat-tutor/shared";

export function PracticeScreen() {
  const questions = SEED_QUESTIONS;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<
    { questionId: string; selectedOptionId: string; correct: boolean }[]
  >([]);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const stats = useMemo(
    () =>
      summarizeSession({
        id: "live",
        startedAt: new Date().toISOString(),
        section: question?.section ?? "math",
        answers: answers.map((a) => ({
          questionId: a.questionId,
          selectedOptionId: a.selectedOptionId,
          correct: a.correct,
          timeSpentMs: 0,
          answeredAt: new Date().toISOString(),
        })),
      }),
    [answers, question]
  );

  function handleReveal() {
    if (!selected || !question) return;
    setRevealed(true);
    setAnswers((prev) => [
      ...prev,
      {
        questionId: question.id,
        selectedOptionId: selected,
        correct: selected === question.correctOptionId,
      },
    ]);
  }

  function handleNext() {
    if (isLast) {
      setAnswers([]);
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
    setSelected(null);
    setRevealed(false);
  }

  if (!question) {
    return <Text style={styles.empty}>No questions available.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>
          Question {index + 1} of {questions.length}
        </Text>
        <Text style={styles.headerText}>
          Accuracy: {stats.accuracy}%
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {question.section === "math" ? "Math" : "Reading & Writing"}
            </Text>
          </View>
          <View style={[styles.badge, styles.badgeNeutral]}>
            <Text style={styles.badgeNeutralText}>
              {question.difficulty}
            </Text>
          </View>
        </View>

        {question.passage ? (
          <Text style={styles.passage}>{question.passage}</Text>
        ) : null}

        <Text style={styles.prompt}>{question.prompt}</Text>

        <View style={styles.options}>
          {question.options.map((opt) => {
            const isCorrect =
              revealed && opt.id === question.correctOptionId;
            const isWrong =
              revealed && opt.id === selected && !isCorrect;
            const isSelected = selected === opt.id;

            let border = "#e5e5e5";
            let bg = "#ffffff";
            if (isCorrect) {
              border = "#22c55e";
              bg = "#f0fdf4";
            } else if (isWrong) {
              border = "#ef4444";
              bg = "#fef2f2";
            } else if (isSelected) {
              border = "#4f46e5";
              bg = "#eef2ff";
            }

            return (
              <Pressable
                key={opt.id}
                disabled={revealed}
                onPress={() => setSelected(opt.id)}
                style={[
                  styles.option,
                  { borderColor: border, backgroundColor: bg },
                ]}
              >
                <Text style={styles.optionLetter}>{opt.id}.</Text>
                <Text style={styles.optionText}>{opt.text}</Text>
              </Pressable>
            );
          })}
        </View>

        {revealed ? (
          <View style={styles.explanation}>
            <Text style={styles.explanationTitle}>Explanation</Text>
            <Text style={styles.explanationBody}>
              {question.explanation}
            </Text>
          </View>
        ) : null}
      </View>

      {!revealed ? (
        <Pressable
          onPress={handleReveal}
          disabled={!selected}
          style={[
            styles.button,
            !selected && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>Check answer</Text>
        </Pressable>
      ) : (
        <Pressable onPress={handleNext} style={[styles.button, styles.buttonDark]}>
          <Text style={styles.buttonText}>
            {isLast ? "Restart" : "Next question"}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  empty: {
    color: "#737373",
    textAlign: "center",
    marginTop: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    color: "#737373",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    padding: 20,
    gap: 16,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    backgroundColor: "#eef2ff",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#4338ca",
    fontSize: 12,
    fontWeight: "600",
  },
  badgeNeutral: {
    backgroundColor: "#f5f5f5",
  },
  badgeNeutralText: {
    color: "#525252",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  passage: {
    color: "#525252",
    fontStyle: "italic",
    fontSize: 14,
    borderLeftWidth: 2,
    borderLeftColor: "#d4d4d4",
    paddingLeft: 12,
  },
  prompt: {
    color: "#171717",
    fontSize: 17,
    lineHeight: 24,
  },
  options: {
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  optionLetter: {
    color: "#737373",
    fontWeight: "700",
  },
  optionText: {
    color: "#171717",
    fontSize: 15,
    flex: 1,
  },
  explanation: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  explanationTitle: {
    color: "#171717",
    fontWeight: "700",
    fontSize: 14,
  },
  explanationBody: {
    color: "#404040",
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDark: {
    backgroundColor: "#171717",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
});
