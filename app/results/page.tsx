"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"

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
  efficiency: number;
  score: number;
}

// Helper functions
const formatDateRange = (start: Date, end: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
};

const getDayType = (date: Date, holidays: Holiday[], leaveDays: Date[]): {
  type: 'weekend' | 'holiday' | 'leave' | 'workday';
  holiday?: Holiday;
} => {
  const day = date.getDay();
  if (day === 0 || day === 6) return { type: 'weekend' };
  
  const holiday = holidays.find(h => 
    new Date(h.date).toDateString() === date.toDateString()
  );
  if (holiday) return { type: 'holiday', holiday };

  if (leaveDays.some(leave => leave.toDateString() === date.toDateString())) {
    return { type: 'leave' };
  }

  return { type: 'workday' };
};

// Add new helper function to get break pattern type
const getBreakPatternType = (opportunity: BreakOpportunity): string => {
  const { totalDays, leaveDays, holidays } = opportunity;
  
  if (totalDays >= 7) return "Extended Break";
  if (holidays.length > 1) return "Multi-Holiday Break";
  if (leaveDays.length <= 2 && totalDays >= 4) return "Long Weekend";
  return "Short Break";
};

export default function ResultsPage() {
  const router = useRouter()
  const [opportunities, setOpportunities] = useState<BreakOpportunity[]>([])

  useEffect(() => {
    // Get and parse the opportunities data from URL
    const searchParams = new URLSearchParams(window.location.search);
    const data = searchParams.get('data');
    
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        // Convert string dates back to Date objects
        const hydratedOpportunities = parsedData.map((opp: any) => ({
          ...opp,
          startDate: new Date(opp.startDate),
          endDate: new Date(opp.endDate),
          leaveDays: opp.leaveDays.map((d: string) => new Date(d))
        }));
        setOpportunities(hydratedOpportunities);
      } catch (error) {
        console.error('Error parsing opportunities data:', error);
        router.push('/');
      }
    } else {
      // No data found, redirect back to home
      router.push('/');
    }
  }, [router]);

  const displayedOpportunities = opportunities.slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="rounded-full -ml-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Perfect Timing!</h1>
            <p className="text-sm text-muted-foreground mt-1">Here are your best break options</p>
          </div>
        </div>

        {/* Break Opportunities */}
        <div className="space-y-4">
          {displayedOpportunities.map((opportunity, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold tracking-tight">{opportunity.totalDays} Days Off</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-medium tracking-tight">
                          {opportunity.efficiency.toFixed(1)}x
                        </span>
                        <span className={`text-sm px-2 py-0.5 rounded-full font-medium tracking-tight ${
                          opportunity.totalDays >= 7
                            ? 'bg-purple-50 text-purple-700'
                            : opportunity.holidays.length > 1
                            ? 'bg-blue-50 text-blue-700'
                            : opportunity.leaveDays.length <= 2
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}>
                          {getBreakPatternType(opportunity)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className="text-sm text-muted-foreground">
                        {formatDateRange(opportunity.startDate, opportunity.endDate)}
                      </p>
                      <span className="text-sm text-orange-600 font-medium">
                        · {opportunity.leaveDays.length} {opportunity.leaveDays.length === 1 ? 'leave' : 'leaves'}
                      </span>
                      {opportunity.holidays.length > 0 && (
                        <span className="text-sm text-green-600 font-medium">
                          · {opportunity.holidays.length} {opportunity.holidays.length === 1 ? 'holiday' : 'holidays'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Break Timeline */}
                <div className="space-y-1.5">
                  {Array.from({ length: opportunity.totalDays }).map((_, i) => {
                    const currentDate = new Date(opportunity.startDate);
                    currentDate.setDate(opportunity.startDate.getDate() + i);
                    const dayType = getDayType(currentDate, opportunity.holidays, opportunity.leaveDays);
                    
                    return (
                      <div 
                        key={i} 
                        className={`
                          flex items-center px-4 py-3 rounded-lg
                          ${dayType.type === 'weekend' ? 'bg-blue-50/60 text-blue-700' : ''}
                          ${dayType.type === 'holiday' ? 'bg-green-50/60 text-green-700' : ''}
                          ${dayType.type === 'leave' ? 'bg-orange-50/60 text-orange-700' : ''}
                          ${dayType.type === 'workday' ? 'bg-gray-50/60 text-gray-600' : ''}
                        `}
                      >
                        <div className="grid grid-cols-[3rem,2rem,1fr] items-center gap-3">
                          <div className="text-sm font-medium tracking-wide uppercase">
                            {currentDate.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="text-lg font-bold tracking-tight">
                            {currentDate.toLocaleDateString('en-US', { day: 'numeric' })}
                          </div>
                          <div className="text-sm font-medium">
                            {dayType.type === 'holiday' && dayType.holiday?.name}
                            {dayType.type === 'weekend' && 'Weekend'}
                            {dayType.type === 'leave' && 'Take Leave'}
                            {dayType.type === 'workday' && 'Work Day'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {opportunities.length > 2 && (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {opportunities.length - 2} more break opportunities available
            </p>
            <Link href="/upgrade">
              <Button
                variant="default"
                className="text-sm font-medium"
              >
                Unlock All Options
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 