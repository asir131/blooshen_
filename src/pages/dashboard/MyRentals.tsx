import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, CalendarDays, Pencil, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockMyRentalVehicles, mockBookedRentals } from "@/data/mockDashboard";

const statusColors = {
  Upcoming: "bg-cta/15 text-cta",
  Active: "bg-success/15 text-success",
  Completed: "bg-secondary text-muted-foreground",
};

const MyRentals = () => {
  const [subTab, setSubTab] = useState<"vehicles" | "booked">("vehicles");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">My Rentals</h1>

      <div className="inline-flex bg-secondary rounded-md p-1 gap-1">
        <button
          onClick={() => setSubTab("vehicles")}
          className={cn("px-4 py-2 rounded font-heading font-bold text-sm uppercase tracking-wider transition-colors", subTab === "vehicles" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          My Vehicles for Rent
        </button>
        <button
          onClick={() => setSubTab("booked")}
          className={cn("px-4 py-2 rounded font-heading font-bold text-sm uppercase tracking-wider transition-colors", subTab === "booked" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          Rentals I've Booked
        </button>
      </div>

      {subTab === "vehicles" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockMyRentalVehicles.map((v) => (
            <Card key={v.id} className="border-border bg-card overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <img src={v.photo} alt={v.name} className="w-full sm:w-40 h-32 object-cover shrink-0" />
                  <div className="p-4 flex-1 space-y-2">
                    <h3 className="font-heading font-bold text-foreground">{v.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground font-bold">${v.dailyRate}</span>/day
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{v.daysBookedThisMonth} days booked this month</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-4 w-4 text-success" />
                      <span className="font-heading font-bold text-success">${v.earningsToDate.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">earnings to date</span>
                    </div>
                    <Button size="sm" variant="secondary">
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit Availability
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Vehicle</TableHead>
                  <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Owner</TableHead>
                  <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Dates</TableHead>
                  <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Total</TableHead>
                  <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-muted-foreground font-heading text-xs uppercase tracking-wider text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBookedRentals.map((b) => (
                  <TableRow key={b.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={b.vehiclePhoto} alt="" className="h-10 w-14 rounded object-cover shrink-0" />
                        <span className="font-medium text-foreground text-sm">{b.vehicleName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{b.ownerName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(b.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(b.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </TableCell>
                    <TableCell className="text-sm font-bold text-foreground">${b.totalPaid}</TableCell>
                    <TableCell>
                      <Badge className={cn("text-[10px]", statusColors[b.status])}>{b.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {b.status === "Completed" && !b.reviewed && (
                        <Button size="sm" variant="secondary">
                          <Star className="h-3.5 w-3.5 mr-1" /> Leave a Review
                        </Button>
                      )}
                      {b.status === "Completed" && b.reviewed && (
                        <span className="text-xs text-muted-foreground">Reviewed ✓</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyRentals;
