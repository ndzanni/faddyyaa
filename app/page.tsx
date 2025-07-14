"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Star, Sparkles, Gift, Coffee, Music, Camera } from "lucide-react"

export default function FadyaWebsite() {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [showMessage, setShowMessage] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [gameCards, setGameCards] = useState<Array<{ id: number; icon: any; isFlipped: boolean; isMatched: boolean }>>(
    [],
  )
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [gameScore, setGameScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])
  const [fallingHearts, setFallingHearts] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [gameStartTime, setGameStartTime] = useState(0)

  const quotes = [
    "Setiap hari bersamamu adalah hari yang spesial ✨",
    "Kamu adalah alasan aku tersenyum setiap pagi 🌅",
    "Dengan kamu, dunia terasa lebih berwarna 🌈",
    "Kamu membuat hatiku berbunga-bunga 🌸",
  ]

  const memories = [
    { icon: Coffee, title: "Coffee Date", desc: "Ngopi bareng sambil ngobrol seharian" },
    { icon: Music, title: "Playlist Kita", desc: "Lagu-lagu yang selalu ngingetin sama kamu" },
    { icon: Camera, title: "Foto Bersama", desc: "Momen-momen indah yang terabadikan" },
    { icon: Gift, title: "Surprise", desc: "Hadiah kecil yang penuh makna" },
  ]

  const fadyaPhotos = [
    { src: "/images/fadya-1.jpeg", alt: "Fadya mirror selfie dengan stiker lucu", rotation: -3 },
    { src: "/images/fadya-3.jpeg", alt: "Fadya dengan filter kumis dan pita lucu", rotation: 5 },
    { src: "/images/fadya-2.jpeg", alt: "Fadya dengan filter anjing lucu", rotation: -2 },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const createHeart = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newHeart = { id: Date.now(), x, y }

    setHearts((prev) => [...prev, newHeart])
    setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id))
    }, 2000)
  }

  const createSparkle = () => {
    const newSparkles = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }))

    setSparkles(newSparkles)
    setTimeout(() => setSparkles([]), 2000)
  }

  const initializeGame = () => {
    setGameScore(0)
    setGameStarted(true)
    setGameWon(false)
    setGameStartTime(Date.now())
    setFallingHearts([])

    // Start spawning hearts
    const spawnInterval = setInterval(() => {
      if (Date.now() - gameStartTime > 30000) {
        clearInterval(spawnInterval)
        setGameWon(true)
        setFallingHearts([])
        return
      }

      const newHeart = {
        id: Date.now() + Math.random(),
        x: Math.random() * 300,
        y: -20,
      }

      setFallingHearts((prev) => [...prev, newHeart])

      // Remove heart after it falls
      setTimeout(() => {
        setFallingHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id))
      }, 4000)
    }, 800)

    // Animate falling hearts
    const animateInterval = setInterval(() => {
      setFallingHearts((prev) =>
        prev
          .map((heart) => ({
            ...heart,
            y: heart.y + 3,
          }))
          .filter((heart) => heart.y < 400),
      )
    }, 50)

    // Stop game after 30 seconds
    setTimeout(() => {
      clearInterval(spawnInterval)
      clearInterval(animateInterval)
      setGameWon(true)
      setFallingHearts([])
    }, 30000)
  }

  const catchHeart = (heartId: number) => {
    setFallingHearts((prev) => prev.filter((heart) => heart.id !== heartId))
    setGameScore((prev) => prev + 1)
    createSparkle()
  }

  const createConfetti = () => {
    const colors = ["#ec4899", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    setConfetti(newConfetti)
    setTimeout(() => setConfetti([]), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Floating Hearts */}
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className="absolute text-pink-500 animate-ping pointer-events-none z-10"
          style={{ left: heart.x, top: heart.y }}
          size={20}
        />
      ))}

      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <Sparkles
          key={sparkle.id}
          className="absolute text-yellow-400 animate-pulse pointer-events-none z-10"
          style={{ left: sparkle.x, top: sparkle.y }}
          size={16}
        />
      ))}

      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 animate-bounce pointer-events-none z-10"
          style={{
            left: piece.x,
            top: piece.y,
            backgroundColor: piece.color,
            animationDuration: "2s",
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-200 animate-bounce">
          <Heart size={30} />
        </div>
        <div className="absolute top-20 right-20 text-purple-200 animate-pulse">
          <Star size={25} />
        </div>
        <div className="absolute bottom-20 left-20 text-indigo-200 animate-bounce delay-1000">
          <Sparkles size={35} />
        </div>
        <div className="absolute bottom-10 right-10 text-pink-200 animate-pulse delay-500">
          <Heart size={20} />
        </div>
      </div>

      <div className="relative z-20">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4" onClick={createHeart}>
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 animate-bounce">
              <Heart className="mx-auto text-pink-500 mb-4" size={60} />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-6 animate-pulse">
              Hi Fadya! 💕
            </h1>

            <p className="text-2xl md:text-3xl text-gray-700 mb-8 font-light">
              Website spesial yang dibuat khusus untukmu ✨
            </p>

            <div className="h-16 flex items-center justify-center mb-8">
              <p className="text-lg md:text-xl text-gray-600 italic animate-fade-in">"{quotes[currentQuote]}"</p>
            </div>

            <Button
              onClick={createSparkle}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="mr-2" size={20} />
              Klik untuk kejutan! ✨
            </Button>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12">Kenapa Kamu Spesial? 💖</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white/70 backdrop-blur-sm border-pink-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="text-pink-500 mb-4">
                    <Heart size={40} className="mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Senyummu</h3>
                  <p className="text-gray-600">
                    Senyummu adalah hal pertama yang membuatku jatuh hati. Setiap kali kamu tersenyum, dunia terasa
                    lebih cerah! 😊
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-purple-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="text-purple-500 mb-4">
                    <Star size={40} className="mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Kepribadianmu</h3>
                  <p className="text-gray-600">
                    Kamu selalu tahu cara membuat hari yang buruk menjadi lebih baik. Kepribadianmu yang ceria selalu
                    menghangatkan hatiku! 🌟
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Interactive Memories */}
        <section className="py-20 px-4 bg-white/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">Kenangan Kita 📸</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {memories.map((memory, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={createHeart}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-indigo-500 mb-4 group-hover:animate-bounce">
                      <memory.icon size={40} className="mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{memory.title}</h3>
                    <p className="text-gray-600 text-sm">{memory.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fadya's Photo Gallery - NEW INTERACTIVE VERSION */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12">Galeri Foto 💖</h2>
            <p className="text-lg text-gray-600 mb-8">
              
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {fadyaPhotos.map((photo, index) => (
                <Card
                  key={index}
                  className="relative bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg cursor-pointer
                             transform-gpu transition-all duration-300 ease-in-out
                             hover:scale-105 hover:shadow-xl hover:rotate-0 group overflow-hidden
                             photo-card" // Added photo-card class for glow effect
                  style={{ transform: `rotate(${photo.rotation}deg)` }}
                >
                  <CardContent className="p-4">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-pink-300">
                      <Image
                        src={photo.src || "/placeholder.svg"}
                        alt={photo.alt}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                        unoptimized // Penting untuk static export
                      />
                    </div>
                    {/* Removed description */}
                  </CardContent>
                  {/* Interactive Heart on Hover */}
                  <Heart
                    size={32}
                    className="absolute bottom-4 right-4 text-pink-500 opacity-0 group-hover:opacity-100
                                 group-hover:animate-heart-beat transition-opacity duration-300"
                    fill="currentColor"
                  />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mini Game Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12">Mini Game Seru! 🎮</h2>

            {!gameStarted ? (
              <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
                <CardContent className="p-12">
                  <div className="text-pink-500 mb-6">
                    <Heart size={60} className="mx-auto animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Catch the Hearts! 💕</h3>
                  <p className="text-gray-600 mb-8">
                    Tangkap sebanyak mungkin heart yang jatuh dalam 30 detik! Setiap heart yang kamu tangkap adalah
                    simbol cintaku untukmu! 💖
                  </p>
                  <Button
                    onClick={initializeGame}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Heart className="mr-2" size={20} />
                    Mulai Game!
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div>
                <div className="flex justify-center items-center gap-8 mb-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                    <span className="text-lg font-bold text-gray-800">Hearts: {gameScore}</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                    <span className="text-lg font-bold text-gray-800">
                      Time: {Math.max(0, 30 - Math.floor((Date.now() - gameStartTime) / 1000))}s
                    </span>
                  </div>
                  <Button
                    onClick={initializeGame}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Reset Game
                  </Button>
                </div>

                {gameWon && (
                  <div className="mb-8 animate-bounce">
                    <Card className="bg-gradient-to-r from-pink-100 to-purple-100 border-pink-300 shadow-xl">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold text-pink-600 mb-2">🎉 Amazing Fadya! 🎉</h3>
                        <p className="text-gray-700">
                          Kamu berhasil menangkap {gameScore} hearts! That's how much I love you! 💕
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="relative bg-gradient-to-b from-blue-100 to-green-100 rounded-lg h-96 overflow-hidden border-4 border-pink-200 shadow-xl">
                  {/* Falling Hearts */}
                  {fallingHearts.map((heart) => (
                    <Heart
                      key={heart.id}
                      className="absolute text-pink-500 cursor-pointer hover:text-pink-600 transition-colors animate-pulse"
                      style={{
                        left: heart.x,
                        top: heart.y,
                        fontSize: "24px",
                      }}
                      size={24}
                      onClick={() => catchHeart(heart.id)}
                    />
                  ))}

                  {/* Game Instructions */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-gray-500 text-lg font-medium opacity-50">Klik hearts yang jatuh! 💖</p>
                  </div>
                </div>

                <p className="text-gray-600 mt-6 italic">
                  "Setiap heart yang kamu tangkap adalah bukti cintaku untukmu! 💕"
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Message Section with Envelope */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12">Surat Cinta Untukmu 💌</h2>

            <div className="relative max-w-md mx-auto">
              {!showMessage ? (
                <div
                  onClick={() => setShowMessage(true)}
                  className="cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  {/* Envelope */}
                  <div className="relative">
                    {/* Envelope Body */}
                    <div className="w-80 h-56 bg-gradient-to-br from-pink-200 to-rose-300 rounded-lg shadow-xl border-2 border-pink-300 mx-auto relative overflow-hidden">
                      {/* Envelope Flap */}
                      <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-br from-pink-300 to-rose-400 transform origin-top transition-transform duration-500 hover:rotate-12">
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-40 border-r-40 border-t-28 border-l-transparent border-r-transparent border-t-pink-400"></div>
                      </div>

                      {/* Heart Seal */}
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-red-500 rounded-full p-3 shadow-lg animate-pulse">
                          <Heart className="text-white" size={20} fill="currentColor" />
                        </div>
                      </div>

                      {/* Envelope Address */}
                      <div className="absolute bottom-8 left-8 right-8">
                        <p className="text-gray-700 font-handwriting text-lg">Untuk: Fadya ✨</p>
                        <p className="text-gray-600 font-handwriting text-sm mt-1">From: Someone who loves you 💕</p>
                      </div>
                    </div>

                    {/* Click instruction */}
                    <p className="text-gray-600 mt-4 animate-bounce">Klik amplop untuk membuka surat! 💌</p>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  {/* Opened Letter */}
                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 shadow-2xl transform rotate-1">
                    <CardContent className="p-8 relative">
                      {/* Letter Header */}
                      <div className="text-center mb-6">
                        <div className="flex justify-center items-center gap-2 mb-4">
                          <Heart className="text-red-500" size={24} fill="currentColor" />
                          <h3 className="text-2xl font-bold text-gray-800 font-serif">Surat Cinta</h3>
                          <Heart className="text-red-500" size={24} fill="currentColor" />
                        </div>
                        <p className="text-gray-600 font-serif italic">Untuk Fadya tersayang...</p>
                      </div>

                      {/* Letter Content */}
                      <div className="text-left space-y-4 font-serif text-gray-700 leading-relaxed">
                        <p className="text-lg">Fadya sayang,</p>

                        <p>
                          Setiap kali aku melihat senyummu, dunia terasa lebih indah. Kamu adalah cahaya yang menerangi
                          hari-hariku, dan kehadiranmu membuat segala sesuatu terasa lebih bermakna.
                        </p>

                        <p>
                          Aku ingin kamu tahu bahwa kamu sangat istimewa bagiku. Setiap detik bersamamu adalah anugerah
                          yang tak ternilai harganya. Kamu membuat hatiku berbunga-bunga dan membuat aku percaya pada
                          keajaiban cinta.
                        </p>

                        <p>
                          Website ini adalah cara kecilku untuk menunjukkan betapa berharganya kamu. Semoga setiap kali
                          kamu membukanya, kamu akan teringat betapa spesialnya kamu di hatiku.
                        </p>

                        <p className="text-right mt-8">
                          Dengan cinta,
                          <br />
                          <span className="font-bold">Someone who adores you 💕</span>
                        </p>
                      </div>

                      {/* Letter decorations */}
                      <div className="absolute top-4 right-4">
                        <Sparkles className="text-yellow-400" size={20} />
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Heart className="text-pink-400" size={16} />
                      </div>

                      {/* Close button */}
                      <div className="text-center mt-8">
                        <Button
                          onClick={() => setShowMessage(false)}
                          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                          Tutup Surat 💌
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center">
          <p className="text-gray-600 mb-4">Made with 💕 especially for Fadya</p>
          <div className="flex justify-center space-x-4">
            <Heart className="text-pink-500 animate-pulse" size={20} />
            <Star className="text-yellow-500 animate-pulse delay-200" size={20} />
            <Sparkles className="text-purple-500 animate-pulse delay-400" size={20} />
          </div>
        </footer>
      </div>
    </div>
  )
}
