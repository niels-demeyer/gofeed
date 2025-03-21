import * as React from "react";

export function ClockTop() {
  const [time, setTime] = React.useState<Date>(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex items-center justify-center font-medium">
      <span>{formattedTime}</span>
    </div>
  );
}
