"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Check,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getNotes, saveNotes } from "../lib/storage";
import { monthBackground } from "../lib/background";

const getHolidays = (year: number) => ({
  [`${year}-01-01`]: "New Year's Day",
  [`${year}-01-14`]: "Makar Sankranti / Pongal",
  [`${year}-01-26`]: "Republic Day",
  [`${year}-02-15`]: "Maha Shivratri",
  [`${year}-03-04`]: "Holi",
  [`${year}-03-20`]: "Eid-ul-Fitr",
  [`${year}-03-31`]: "Mahavir Jayanti",
  [`${year}-04-03`]: "Good Friday",
  [`${year}-04-14`]: "Ambedkar Jayanti",
  [`${year}-05-01`]: "Buddha Purnima",
  [`${year}-05-27`]: "Eid-ul-Adha",
  [`${year}-07-26`]: "Muharram",
  [`${year}-08-15`]: "Independence Day",
  [`${year}-08-26`]: "Raksha Bandhan",
  [`${year}-09-04`]: "Janmashtami",
  [`${year}-09-14`]: "Ganesh Chaturthi",
  [`${year}-10-02`]: "Gandhi Jayanti",
  [`${year}-10-20`]: "Dussehra",
  [`${year}-11-08`]: "Diwali",
  [`${year}-11-24`]: "Guru Nanak Jayanti",
  [`${year}-12-25`]: "Christmas Day",
  [`${year}-12-31`]: "New Year's Eve",
});

export default function Calendar({ currentDate, setCurrentDate }: any) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const [notes, setNotes] = useState<any>({});
  const [activeNote, setActiveNote] = useState("");
  const [editingType, setEditingType] = useState<"month" | "day" | "range">(
    "month",
  );
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [range, setRange] = useState<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });
  const [isSaving, setIsSaving] = useState(false);
  const [direction, setDirection] = useState(0);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const prevMonthDays = new Date(year, month, 0).getDate();

  const grid = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startOffset + 1;
    if (dayNumber <= 0)
      return { day: prevMonthDays + dayNumber, current: false, index: i };
    if (dayNumber > daysInMonth)
      return { day: dayNumber - daysInMonth, current: false, index: i };
    return { day: dayNumber, current: true, index: i };
  });

  const holidays = getHolidays(year);

  useEffect(() => {
    const stored = getNotes();
    setNotes(stored);
    setActiveNote(stored[monthKey]?.monthNote || "");
    setEditingType("month");
    setRange({ start: null, end: null });
  }, [monthKey]);

  const handleMonthChange = (offset: number) => {
    setDirection(offset);
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const handleSave = () => {
    setIsSaving(true);
    const updatedNotes = { ...notes };
    if (!updatedNotes[monthKey])
      updatedNotes[monthKey] = {
        monthNote: "",
        dailyNotes: {},
        rangeNotes: {},
      };

    if (editingType === "month") {
      updatedNotes[monthKey].monthNote = activeNote;
    } else if (editingType === "day" && selectedDayKey) {
      if (!updatedNotes[monthKey].dailyNotes)
        updatedNotes[monthKey].dailyNotes = {};
      updatedNotes[monthKey].dailyNotes[selectedDayKey] = activeNote;
    } else if (editingType === "range" && range.start && range.end) {
      const rangeKey = `${range.start}_${range.end}`;
      if (!updatedNotes[monthKey].rangeNotes)
        updatedNotes[monthKey].rangeNotes = {};
      updatedNotes[monthKey].rangeNotes[rangeKey] = activeNote;
    }

    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleDayClick = (day: number) => {
    const key = `${monthKey}-${String(day).padStart(2, "0")}`;
    setSelectedDayKey(key);

    if (!range.start || range.end) {
      setRange({ start: key, end: null });
      setEditingType("day");
      setActiveNote(notes[monthKey]?.dailyNotes?.[key] || "");
    } else {
      const startTime = new Date(range.start).getTime();
      const clickedTime = new Date(key).getTime();

      let newRange = { start: range.start, end: key };
      if (clickedTime < startTime) {
        newRange = { start: key, end: range.start };
      } else if (clickedTime === startTime) {
        setRange({ start: null, end: null });
        switchToMonthNote();
        return;
      }

      setRange(newRange);
      setEditingType("range");
      const rangeKey = `${newRange.start}_${newRange.end}`;
      setActiveNote(notes[monthKey]?.rangeNotes?.[rangeKey] || "");
    }
  };

  const switchToMonthNote = () => {
    setEditingType("month");
    setSelectedDayKey(null);
    setRange({ start: null, end: null });
    setActiveNote(notes[monthKey]?.monthNote || "");
  };

  const isWeekend = (index: number) => {
    return index % 7 === 5 || index % 7 === 6;
  };

  const getRangeDisplayText = () => {
    if (!range.start) return null;
    const startDate = new Date(range.start);
    const endDate = range.end ? new Date(range.end) : null;

    if (!endDate) {
      return `${startDate.toLocaleDateString("default", { month: "short", day: "numeric" })}`;
    }

    return `${startDate.toLocaleDateString("default", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("default", { month: "short", day: "numeric" })}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200/60 mx-auto"
    >
      <div className="relative h-48 md:h-56 flex items-center justify-center text-white overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={monthKey}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${monthBackground[month]})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

        <div className="relative z-10 text-center px-4">
          <motion.h1
            key={`title-${monthKey}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-serif tracking-tight drop-shadow-lg text-white mb-2"
          >
            {currentDate.toLocaleString("default", { month: "long" })}
          </motion.h1>
          <p className="text-xs tracking-[0.4em] opacity-90 uppercase font-medium text-white/90">
            {year}
          </p>
        </div>

        <div className="absolute inset-x-6 flex justify-between z-20">
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMonthChange(-1)}
            className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 transition shadow-lg"
          >
            <ChevronLeft size={22} className="text-white" />
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMonthChange(1)}
            className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 transition shadow-lg"
          >
            <ChevronRight size={22} className="text-white" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr]">
        <div className="p-6 md:p-8 bg-gradient-to-b from-stone-50 to-white border-r border-stone-200/60 flex flex-col gap-5">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={switchToMonthNote}
              className={`flex items-center gap-2.5 transition-all duration-300 px-3 py-1.5 rounded-full ${
                editingType === "month"
                  ? "bg-[#C26343]/10 text-[#C26343]"
                  : "text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              }`}
            >
              <FileText
                size={18}
                strokeWidth={editingType === "month" ? 2.5 : 2}
              />
              <h2 className="text-sm font-serif font-medium">Monthly Note</h2>
            </button>

            {editingType !== "month" && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[10px] font-bold text-[#C26343] bg-[#C26343]/10 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5"
              >
                {editingType === "day" ? (
                  "Single Day"
                ) : (
                  <>
                    <Layers size={12} /> Range
                  </>
                )}
              </motion.span>
            )}
          </div>

          {editingType === "range" && range.start && range.end && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg text-center font-medium"
            >
              {getRangeDisplayText()}
            </motion.div>
          )}

          <div className="relative flex-1">
            <textarea
              value={activeNote}
              onChange={(e) => setActiveNote(e.target.value)}
              className="w-full h-full min-h-[180px] md:min-h-[260px] p-5 rounded-2xl border border-stone-200 text-sm text-stone-700 
                focus:ring-2 focus:ring-[#C26343]/20 focus:border-[#C26343]/40 outline-none resize-none shadow-inner 
                bg-stone-50/50 leading-relaxed placeholder:text-stone-400 transition-all"
              placeholder={
                editingType === "month"
                  ? "Journal your thoughts for this month..."
                  : editingType === "range"
                    ? `Notes for ${getRangeDisplayText()}...`
                    : "Daily reflections..."
              }
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-stone-300 font-medium">
              {activeNote.length} chars
            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 30px -10px rgba(194, 99, 67, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className={`py-3.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
              isSaving
                ? "bg-emerald-600 text-white"
                : "bg-[#C26343] text-white hover:bg-[#A85236]"
            }`}
          >
            {isSaving ? (
              <>
                <Check size={16} className="animate-bounce" /> Saved
                Successfully
              </>
            ) : (
              `Save ${editingType} Note`
            )}
          </motion.button>

          <div className="mt-2 pt-4 border-t border-stone-200/60 space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-stone-500">
              <div className="w-2 h-2 rounded-full bg-[#C26343]" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-stone-500">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Holiday</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-stone-500">
              <div className="w-2 h-2 rounded-full bg-stone-300" />
              <span>Has Note</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-white">
          <div className="grid grid-cols-7 mb-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
              <div
                key={i}
                className={`text-[11px] font-bold tracking-wider text-center py-2 ${
                  i >= 5 ? "text-amber-600/70" : "text-stone-400"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={monthKey}
              custom={direction}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="grid grid-cols-7 gap-y-2 gap-x-1"
            >
              {grid.map((item, i) => {
                const key = `${monthKey}-${String(item.day).padStart(2, "0")}`;
                const startT = range.start
                  ? new Date(range.start).getTime()
                  : null;
                const endT = range.end ? new Date(range.end).getTime() : null;
                const currT = new Date(key).getTime();

                const isStart = item.current && key === range.start;
                const isEnd = item.current && key === range.end;
                const inRange =
                  item.current &&
                  startT &&
                  endT &&
                  currT > startT &&
                  currT < endT;

                const isToday = item.current && key === todayKey;
                const isSelected = item.current && key === selectedDayKey;
                const weekend = isWeekend(i);
                const isHoliday = holidays[key] !== undefined;

                const hasDayNote =
                  notes[monthKey]?.dailyNotes?.[key]?.length > 0;
                const hasRangeNote =
                  notes[monthKey]?.rangeNotes &&
                  Object.keys(notes[monthKey].rangeNotes).some((rk) => {
                    const [rs, re] = rk.split("_");
                    return (
                      currT >= new Date(rs).getTime() &&
                      currT <= new Date(re).getTime() &&
                      notes[monthKey].rangeNotes[rk].length > 0
                    );
                  });

                return (
                  <div
                    key={i}
                    className="relative py-1 flex justify-center h-12 md:h-14"
                  >
                    {item.current &&
                      weekend &&
                      !isSelected &&
                      !isStart &&
                      !isEnd && (
                        <div className="absolute inset-0 bg-amber-50/50 rounded-lg -mx-0.5" />
                      )}

                    {item.current &&
                      (inRange || isStart || isEnd) &&
                      range.end && (
                        <motion.div
                          layoutId="range"
                          className={`absolute inset-y-1 bg-[#C26343]/10 z-0 rounded-sm
                          ${inRange ? "inset-x-0" : ""}
                          ${isStart ? "left-1/2 right-0 rounded-l-sm" : ""}
                          ${isEnd ? "right-1/2 left-0 rounded-r-sm" : ""}
                        `}
                        />
                      )}

                    <motion.button
                      whileHover={item.current ? { scale: 1.1, y: -2 } : {}}
                      whileTap={item.current ? { scale: 0.95 } : {}}
                      onClick={() => item.current && handleDayClick(item.day)}
                      onMouseEnter={() => item.current && setHoveredDay(key)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`
                        relative z-10 w-10 h-10 md:w-11 md:h-11 rounded-xl text-[12px] transition-all duration-200 flex flex-col items-center justify-center
                        ${!item.current ? "text-stone-200 pointer-events-none" : "text-stone-600"} 
                        ${weekend && item.current && !isSelected && !isStart && !isEnd ? "text-amber-700 font-medium" : ""}
                        ${isSelected || isStart || isEnd ? "bg-[#C26343] text-white font-bold shadow-lg shadow-[#C26343]/30" : ""}
                        ${inRange ? "text-[#C26343] font-semibold" : ""}
                        ${isHoliday && !isSelected && !isStart && !isEnd ? "ring-1 ring-amber-400/50" : ""}
                      `}
                    >
                      <span className="relative z-10">{item.day}</span>

                      <div className="flex gap-1 absolute bottom-1.5 items-center">
                        {isToday && (
                          <div
                            className={`
                            w-1.5 h-1.5 rounded-full 
                            ${isSelected || isStart || isEnd ? "bg-white" : "bg-[#C26343]"}
                          `}
                          />
                        )}

                        {isHoliday && !isSelected && !isStart && !isEnd && (
                          <Sparkles size={8} className="text-amber-500" />
                        )}

                        {(hasDayNote || hasRangeNote) &&
                          !isSelected &&
                          !isStart &&
                          !isEnd && (
                            <div
                              className={`
                            w-1.5 h-1.5 rounded-full 
                            ${hasRangeNote ? "bg-[#C26343]/60" : "bg-stone-300"}
                          `}
                            />
                          )}
                      </div>

                      {isHoliday && hoveredDay === key && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none"
                        >
                          {holidays[key]}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-800 rotate-45" />
                        </motion.div>
                      )}

                      {editingType === "range" && !range.end && isSelected && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none"
                        >
                          Click end date
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-800 rotate-45" />
                        </motion.div>
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 pt-4 border-t border-stone-100 flex justify-between items-center text-[11px] text-stone-400">
            <span>
              {new Date(year, month, 1).toLocaleDateString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>{daysInMonth} days</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}