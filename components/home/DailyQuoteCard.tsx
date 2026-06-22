"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useDailyQuote } from "@/hooks/useDailyQuote";

export default function DailyQuoteCard() {
  const { quote, saveQuote } = useDailyQuote();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSave = () => {
    if (inputValue.trim()) {
      saveQuote(inputValue.trim());
      setIsEditing(false);
    }
  };

  return (
    <Card>
      <h3 className="text-base font-bold text-secondary mb-3">오늘의 한마디</h3>
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="오늘의 한마디를 입력하세요"
            className="w-full p-3 bg-gray rounded-xl text-secondary resize-none h-20 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button size="sm" onClick={handleSave} className="flex-1">
              저장
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-secondary text-base leading-relaxed mb-3">
            &ldquo;{quote}&rdquo;
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setInputValue(quote);
              setIsEditing(true);
            }}
          >
            수정하기
          </Button>
        </div>
      )}
    </Card>
  );
}
