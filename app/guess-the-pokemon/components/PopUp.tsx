import React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PopUpProps {
  isOpen: boolean
  onClose: () => void
  title: string
  borderColour: string
  children: React.ReactNode
  showCloseButton?: boolean
}

const PopUp = ({
  isOpen,
  onClose,
  title,
  borderColour,
  children,
  showCloseButton = true,
}: PopUpProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div
              className={`relative flex flex-col items-center text-center bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border-2 ${borderColour}`}
            >
              {/* Close Button */}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-3 right-5 text-gray-400 hover:text-white hover:scale-105 text-4xl transition-all"
                >
                  x
                </button>
              )}

              {/* Header */}
              <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>

              {/* Content */}
              <div className="text-white">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PopUp
