import { Card, CardContent } from "../../ui/card";

interface TabLoadingStateProps {
  label: string;
}

export function TabLoadingState({ label }: TabLoadingStateProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="py-12 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-gray-700 border-t-green-400" />
        <p className="text-gray-300">Memuat {label}...</p>
      </CardContent>
    </Card>
  );
}
