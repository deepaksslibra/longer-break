"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

interface Holiday {
  id: string;
  date: string;
  name: string;
  type: 'National' | 'Regional' | 'Optional' | 'Restricted';
  isSelected: boolean;
  day: string;
}

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedState, setSelectedState] = useState<string>("")
  
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

  const hasLocationSelected = selectedCountry && selectedState

  const guaranteedHolidays = holidays.filter(h => h.type === 'National' || h.type === 'Regional')
  const probableHolidays = holidays.filter(h => h.type === 'Optional' || h.type === 'Restricted')

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="container mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">Longer Break</h1>
        <p className="text-muted-foreground text-center">Find the perfect time for your extended breaks</p>
      </div>

      <div className="container mx-auto grid gap-6">
        {/* Location Selection */}
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>Select your country and state to find local holidays</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
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
                    <>
                      <SelectItem value="ka">Karnataka</SelectItem>
                      <SelectItem value="mh">Maharashtra</SelectItem>
                      <SelectItem value="dl">Delhi</SelectItem>
                    </>
                  )}
                  {selectedCountry === "us" && (
                    <>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {hasLocationSelected && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Guaranteed Holidays List */}
            <Card>
              <CardHeader>
                <CardTitle>Guaranteed Public Holidays</CardTitle>
                <CardDescription>Official holidays declared by the government</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guaranteedHolidays.map((holiday) => (
                    <div key={holiday.id} className="flex items-center space-x-4 py-2 border-b last:border-0">
                      <Checkbox 
                        id={holiday.id}
                        checked={holiday.isSelected}
                        onCheckedChange={() => toggleHoliday(holiday.id)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={holiday.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {holiday.name}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {holiday.day}, {new Date(holiday.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        holiday.type === 'National' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {holiday.type}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Probable Holidays List */}
            <Card>
              <CardHeader>
                <CardTitle>Probable Holidays</CardTitle>
                <CardDescription>Optional or restricted holidays based on company policy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {probableHolidays.map((holiday) => (
                    <div key={holiday.id} className="flex items-center space-x-4 py-2 border-b last:border-0">
                      <Checkbox 
                        id={holiday.id}
                        checked={holiday.isSelected}
                        onCheckedChange={() => toggleHoliday(holiday.id)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={holiday.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {holiday.name}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {holiday.day}, {new Date(holiday.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        holiday.type === 'Optional' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {holiday.type}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Holidays */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Company Holidays</CardTitle>
                <CardDescription>Add your company&apos;s specific holidays</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                  >
                    + Add Company Holiday
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Find Breaks Button */}
            <div className="md:col-span-2 flex justify-center">
              <Button 
                size="lg" 
                className="w-full md:w-auto"
              >
                Find Break Opportunities
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
