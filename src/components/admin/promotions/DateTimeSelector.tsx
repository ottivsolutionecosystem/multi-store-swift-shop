
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateTimeSelectorProps {
  label: string;
  value?: Date;
  onChange: (date: Date) => void;
  error?: string;
  required?: boolean;
}

export function DateTimeSelector({ 
  label, 
  value, 
  onChange, 
  error, 
  required = false 
}: DateTimeSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    // Preserve existing time if date already exists
    if (value) {
      const newDate = new Date(selectedDate);
      newDate.setHours(value.getHours());
      newDate.setMinutes(value.getMinutes());
      onChange(newDate);
    } else {
      // Set default time to current time
      const now = new Date();
      selectedDate.setHours(now.getHours());
      selectedDate.setMinutes(now.getMinutes());
      onChange(selectedDate);
    }
    setIsOpen(false);
  };

  const handleTimeChange = (timeString: string) => {
    if (!value || !timeString) return;
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(value);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onChange(newDate);
  };

  const formatDateTime = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm");
  };

  const getTimeString = (date: Date) => {
    return format(date, "HH:mm");
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      
      <div className="flex gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "flex-1 justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, "dd/MM/yyyy") : "Selecione uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2 w-32">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Input
            type="time"
            value={value ? getTimeString(value) : ""}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {value && (
        <p className="text-xs text-muted-foreground">
          {formatDateTime(value)}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
