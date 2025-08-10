import { EditorEvents, editorEvents } from "../../MapEditor/events";
import { useEffect } from "preact/hooks";

export function useMessage<T extends keyof EditorEvents>(
  type: T | T[],
  handler: Parameters<typeof editorEvents.sub<T>>[1]
) {
  useEffect(() => {
    const id = editorEvents.sub(type, handler);
    return () => editorEvents.unsub(id);
  });
}
