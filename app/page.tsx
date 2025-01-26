"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Holiday {
  id: string;
  date: string;
  name: string;
  type: 'National' | 'Regional' | 'Optional' | 'Restricted';
  isSelected: boolean;
  day: string;
}

interface BreakOpportunity {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  leaveDays: Date[];
  holidays: Holiday[];
  efficiency: number; // total days / leaves required
  score: number;
}

// Helper function to check if a date is a weekend
const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

// Helper function to check if a date matches a holiday
const isHoliday = (date: Date, holidays: Holiday[]): Holiday | undefined => {
  return holidays.find(h => 
    h.isSelected && new Date(h.date).toDateString() === date.toDateString()
  );
};

// Add new helper function to calculate break pattern score
const getBreakPatternScore = (
  startDate: Date,
  endDate: Date,
  leaveDays: Date[],
  holidays: Holiday[]
): number => {
  const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const efficiency = totalDays / (leaveDays.length || 1);
  
  // Bonus for breaks that include weekends
  const includesWeekend = leaveDays.some(date => {
    const friday = new Date(date);
    friday.setDate(date.getDate() + 1);
    const monday = new Date(date);
    monday.setDate(date.getDate() - 1);
    return isWeekend(friday) || isWeekend(monday);
  });

  // Bonus for breaks that connect multiple holidays
  const uniqueHolidays = new Set(holidays.map(h => h.date)).size;

  // Calculate base score
  let score = efficiency;

  // Add bonuses
  if (includesWeekend) score *= 1.2;
  if (uniqueHolidays > 1) score *= (1 + (uniqueHolidays * 0.1));
  if (totalDays >= 7) score *= 1.3; // Bonus for week-long breaks
  if (leaveDays.length <= 2) score *= 1.1; // Bonus for efficient short breaks

  return score;
};

export default function Home() {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedState, setSelectedState] = useState<string>("")
  const [isHolidaysOpen, setIsHolidaysOpen] = useState(false)
  
  // Karnataka 2025 holidays
  const [holidays, setHolidays] = useState<Holiday[]>([
    // Guaranteed Public Holidays
    { id: "1", date: "2025-01-14", name: "Makara Sankranti", type: "Regional", isSelected: true, day: "Tuesday" },
    { id: "2", date: "2025-01-26", name: "Republic Day", type: "National", isSelected: true, day: "Sunday" },
    { id: "3", date: "2025-03-31", name: "Id-ul-Fitr (Ramzan)", type: "Regional", isSelected: true, day: "Monday" },
    { id: "4", date: "2025-04-10", name: "Mahavir Jayanti", type: "Regional", isSelected: true, day: "Thursday" },
    { id: "5", date: "2025-04-14", name: "Dr. B.R. Ambedkar Jayanti", type: "Regional", isSelected: true, day: "Monday" },
    { id: "6", date: "2025-04-18", name: "Good Friday", type: "National", isSelected: true, day: "Friday" },
    { id: "7", date: "2025-04-30", name: "Basava Jayanti", type: "Regional", isSelected: true, day: "Wednesday" },
    { id: "8", date: "2025-05-01", name: "May Day", type: "National", isSelected: true, day: "Thursday" },
    { id: "9", date: "2025-06-07", name: "Bakrid", type: "Regional", isSelected: true, day: "Saturday" },
    { id: "10", date: "2025-08-15", name: "Independence Day", type: "National", isSelected: true, day: "Friday" },
    { id: "11", date: "2025-08-27", name: "Ganesh Chaturthi", type: "Regional", isSelected: true, day: "Wednesday" },
    { id: "12", date: "2025-09-05", name: "Eid-e-Milad", type: "Regional", isSelected: true, day: "Friday" },
    { id: "13", date: "2025-10-02", name: "Gandhi Jayanti", type: "National", isSelected: true, day: "Thursday" },
    { id: "14", date: "2025-10-22", name: "Deepavali", type: "Regional", isSelected: true, day: "Wednesday" },
    { id: "15", date: "2025-11-01", name: "Kannada Rajyotsava", type: "Regional", isSelected: true, day: "Saturday" },
    { id: "16", date: "2025-12-25", name: "Christmas", type: "National", isSelected: true, day: "Thursday" },
    
    // Probable Holidays
    { id: "17", date: "2025-01-01", name: "New Year's Day", type: "Optional", isSelected: false, day: "Wednesday" },
    { id: "18", date: "2025-02-06", name: "Sri Madvanavami", type: "Restricted", isSelected: false, day: "Thursday" },
    { id: "19", date: "2025-03-13", name: "Holi Festival", type: "Restricted", isSelected: false, day: "Thursday" },
    { id: "20", date: "2025-03-30", name: "Ugadi Festival", type: "Optional", isSelected: false, day: "Sunday" },
    { id: "21", date: "2025-05-12", name: "Buddha Purnima", type: "Restricted", isSelected: false, day: "Monday" },
    { id: "22", date: "2025-08-16", name: "Krishna Janmashtami", type: "Restricted", isSelected: false, day: "Saturday" },
    { id: "23", date: "2025-10-20", name: "Naraka Chaturdashi", type: "Optional", isSelected: false, day: "Monday" },
    { id: "24", date: "2025-11-05", name: "Guru Nanak Jayanti", type: "Restricted", isSelected: false, day: "Wednesday" },
    { id: "25", date: "2025-12-24", name: "Christmas Eve", type: "Optional", isSelected: false, day: "Wednesday" }
  ])

  const toggleHoliday = (id: string) => {
    setHolidays(holidays.map(holiday => 
      holiday.id === id ? { ...holiday, isSelected: !holiday.isSelected } : holiday
    ))
  }

  const findBreakOpportunities = () => {
    const selectedHolidays = holidays.filter(h => h.isSelected);
    const opportunities: BreakOpportunity[] = [];
    
    // Sort holidays by date
    const sortedHolidays = [...selectedHolidays].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Look for different types of break patterns
    sortedHolidays.forEach(holiday => {
      const holidayDate = new Date(holiday.date);
      
      // Look for opportunities in different windows
      const searchWindows = [
        { start: -3, end: 3 },   // Week-centered breaks
        { start: -7, end: 7 },   // Extended breaks
        { start: -2, end: 5 },   // Long weekend style
        { start: -4, end: 4 },   // Mid-week breaks
      ];

      searchWindows.forEach(window => {
        for (let startOffset = window.start; startOffset <= 0; startOffset++) {
          for (let endOffset = 0; endOffset <= window.end; endOffset++) {
            const startDate = new Date(holidayDate);
            startDate.setDate(holidayDate.getDate() + startOffset);
            
            const endDate = new Date(holidayDate);
            endDate.setDate(holidayDate.getDate() + endOffset);

            if (endDate <= startDate) continue;

            const leaveDays: Date[] = [];
            const breakHolidays: Holiday[] = [];

            // Check each day in the range
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
              const isWeekendDay = isWeekend(currentDate);
              const holidayMatch = isHoliday(currentDate, selectedHolidays);

              if (!isWeekendDay && !holidayMatch) {
                leaveDays.push(new Date(currentDate));
              }

              if (holidayMatch) {
                breakHolidays.push(holidayMatch);
              }

              currentDate.setDate(currentDate.getDate() + 1);
            }

            // Consider breaks with different criteria
            const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            
            if ((leaveDays.length <= 4 && breakHolidays.length > 0 && totalDays >= 3) || // Standard breaks
                (leaveDays.length <= 2 && totalDays >= 4) || // Efficient short breaks
                (leaveDays.length <= 6 && breakHolidays.length >= 2)) { // Extended multi-holiday breaks
              
              const efficiency = totalDays / (leaveDays.length || 1);
              const score = getBreakPatternScore(startDate, endDate, leaveDays, breakHolidays);

              opportunities.push({
                startDate,
                endDate,
                totalDays,
                leaveDays,
                holidays: breakHolidays,
                efficiency,
                score // Add score to the interface
              });
            }
          }
        }
      });
    });

    // Find unique break patterns by comparing date ranges
    const uniqueOpportunities = opportunities.reduce((acc, curr) => {
      const dateKey = `${curr.startDate.toISOString()}-${curr.endDate.toISOString()}`;
      if (!acc[dateKey] || acc[dateKey].score < curr.score) {
        acc[dateKey] = curr;
      }
      return acc;
    }, {} as Record<string, BreakOpportunity>);

    // Sort by score and take top results with variety
    const bestOpportunities = Object.values(uniqueOpportunities)
      .sort((a, b) => b.score - a.score)
      .reduce((acc, curr) => {
        // Ensure variety by checking if we already have a similar pattern
        const hasSimilarPattern = acc.some(opp => 
          Math.abs(opp.totalDays - curr.totalDays) <= 1 &&
          Math.abs(opp.leaveDays.length - curr.leaveDays.length) <= 1
        );

        if (!hasSimilarPattern || acc.length < 2) {
          acc.push(curr);
        }

        return acc;
      }, [] as BreakOpportunity[])
      .slice(0, 5); // Get top 5 varied opportunities

    // Convert dates to strings for URL
    const serializedOpportunities = bestOpportunities.map(opp => ({
      ...opp,
      startDate: opp.startDate.toISOString(),
      endDate: opp.endDate.toISOString(),
      leaveDays: opp.leaveDays.map(d => d.toISOString())
    }));

    // Encode the opportunities data for the URL
    const searchParams = new URLSearchParams();
    searchParams.set('data', JSON.stringify(serializedOpportunities));
    
    router.push(`/results?${searchParams.toString()}`);
  };

  const hasLocationSelected = selectedCountry && selectedState

  const guaranteedHolidays = holidays.filter(h => h.type === 'National' || h.type === 'Regional')
  const probableHolidays = holidays.filter(h => h.type === 'Optional' || h.type === 'Restricted')

  const selectedHolidayCount = holidays.filter(h => h.isSelected).length

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="py-2">
          <h1 className="text-3xl font-bold tracking-tight text-center">Longer Break</h1>
          <p className="text-sm text-muted-foreground text-center mt-1.5">Find the perfect time for your extended breaks</p>
        </div>

        {/* Location Selection */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold tracking-tight">Location</CardTitle>
            <CardDescription>Select your country and state to find local holidays</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCountry === "in" && (
                    <SelectItem value="ka">Karnataka</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {hasLocationSelected && (
          <>
            {/* Holiday Selection */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{selectedHolidayCount}</span>
                      <span className="text-xl">Holidays</span>
                    </div>
                    <p className="text-base text-muted-foreground">2025</p>
                  </div>
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => setIsHolidaysOpen(!isHolidaysOpen)}
                    className="gap-1.5"
                  >
                    Customize
                    <ChevronDown className={`h-4 w-4 transition-transform ${isHolidaysOpen ? "rotate-180" : ""}`} />
                  </Button>
                </div>
              </CardContent>

              <Collapsible open={isHolidaysOpen} onOpenChange={setIsHolidaysOpen}>
                <CollapsibleContent>
                  <CardContent className="px-6 pb-6 space-y-8">
                    {/* Guaranteed Holidays */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                          <h3 className="font-medium">Guaranteed</h3>
                        </div>
                        <span className="text-sm font-medium">
                          {guaranteedHolidays.filter(h => h.isSelected).length}/{guaranteedHolidays.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {guaranteedHolidays.map((holiday) => (
                          <div key={holiday.id} 
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              holiday.isSelected ? 'bg-blue-50/50' : 'hover:bg-accent/50'
                            }`}
                          >
                            <Checkbox 
                              id={holiday.id}
                              checked={holiday.isSelected}
                              onCheckedChange={() => toggleHoliday(holiday.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <label htmlFor={holiday.id} className="text-sm font-medium block">
                                {holiday.name}
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {holiday.day}, {new Date(holiday.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Optional Holidays */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange-600"></span>
                          <h3 className="font-medium">Optional</h3>
                        </div>
                        <span className="text-sm font-medium">
                          {probableHolidays.filter(h => h.isSelected).length}/{probableHolidays.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {probableHolidays.map((holiday) => (
                          <div key={holiday.id} 
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              holiday.isSelected ? 'bg-orange-50/50' : 'hover:bg-accent/50'
                            }`}
                          >
                            <Checkbox 
                              id={holiday.id}
                              checked={holiday.isSelected}
                              onCheckedChange={() => toggleHoliday(holiday.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <label htmlFor={holiday.id} className="text-sm font-medium block">
                                {holiday.name}
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {holiday.day}, {new Date(holiday.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>

              <CardContent className="px-6 pb-6">
                <Button 
                  size="lg"
                  variant="default"
                  className="w-full font-medium text-base"
                  onClick={findBreakOpportunities}
                >
                  Find Break Opportunities
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
