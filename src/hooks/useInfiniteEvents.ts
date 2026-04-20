"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchEvents, EventItem, FetchEventsOptions } from "@/lib/events/fetchEvents";

interface UseInfiniteEventsOptions extends Omit<FetchEventsOptions, "cursor"> {}

interface UseInfiniteEventsReturn {
  events: EventItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  /** Call this when filters change to reset back to page 1 */
  reset: () => void;
}

export function useInfiniteEvents(
  options: UseInfiniteEventsOptions = {}
): UseInfiniteEventsReturn {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to track the current options as a stable key
  // When options change, we reset automatically
  const optionsKey = JSON.stringify(options);
  const prevOptionsKey = useRef<string>(optionsKey);

  const loadInitial = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchEvents({ ...options, cursor: undefined });
      setEvents(result.items);
      setCursor(result.nextCursor);
      setHasMore(result.hasNextPage);
    } catch (e: any) {
      setError(e.message ?? "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !cursor) return;
    setIsLoadingMore(true);
    try {
      const result = await fetchEvents({ ...options, cursor });
      setEvents((prev) => [...prev, ...result.items]);
      setCursor(result.nextCursor);
      setHasMore(result.hasNextPage);
    } catch (e: any) {
      setError(e.message ?? "Failed to load more events");
    } finally {
      setIsLoadingMore(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, hasMore, isLoadingMore, optionsKey]);

  const reset = useCallback(() => {
    setEvents([]);
    setCursor(null);
    setHasMore(true);
    setError(null);
    loadInitial();
  }, [loadInitial]);

  // Auto-reset when options change (category, search, dateFilter)
  useEffect(() => {
    if (prevOptionsKey.current !== optionsKey) {
      prevOptionsKey.current = optionsKey;
      setEvents([]);
      setCursor(null);
      setHasMore(true);
    }
    loadInitial();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey]);

  return { events, isLoading, isLoadingMore, hasMore, error, loadMore, reset };
}
