import { useEffect, useState } from "react"

export function useTypewriter(
  words: string[],
  speed = 80,
  pause = 2000,
): string {
  const [displayed, setDisplayed] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), speed)
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), speed / 2)
    } else if (deleting && charIndex === 0) {
      setDeleting(false)
      setWordIndex((i) => (i + 1) % words.length)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, deleting, wordIndex, words, speed, pause])

  useEffect(() => {
    setDisplayed(words[wordIndex].slice(0, charIndex))
  }, [charIndex, wordIndex, words])

  return displayed
}
