// src/services/FinanceLocalService.ts
import { db } from "@/src/db";
import { transaction } from "../db/schema";
import {
    endOfMonth,
    endOfWeek,
    endOfYear,
    format,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subMonths,
    subWeeks,
    subYears,
} from "date-fns";
import { and, gte, lte } from "drizzle-orm";

export interface PeriodBilan {
  periode: string;
  chiffreAffaires: number;
  coutVentes: number;
  margeBrute: number;
  margePourcentage: string;
}

export interface BilanResponse {
  current: PeriodBilan;
  previous: PeriodBilan;
  variation: {
    ca: string;
    cout: string;
    marge: string;
  };
}

class FinanceLocalService {
  private static calculateStats(txs: any[]) {
    let ca = 0;
    let cout = 0;

    txs.forEach((t) => {
      const montant = t.prixUnitaire * t.quantite;
      if (t.type === "SORTIE") ca += montant;
      else if (t.type === "ENTREE") cout += montant;
    });

    const marge = ca - cout;
    const margePourcentage = ca > 0 ? ((marge / ca) * 100).toFixed(1) : "0.0";

    return { ca, cout, marge, margePourcentage };
  }

  private static getVariation(current: number, previous: number): string {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const v = ((current - previous) / previous) * 100;
    return (v > 0 ? "+" : "") + v.toFixed(1) + "%";
  }

  private static async queryByDateRange(start: Date, end: Date) {
    return db
      .select()
      .from(transaction)
      .where(and(gte(transaction.date, start), lte(transaction.date, end)))
      .all();
  }

  // BILAN HEBDOMADAIRE
  static async getBilanHebdomadaire(): Promise<BilanResponse> {
    const now = new Date();
    const currentStart = startOfWeek(now, { weekStartsOn: 1 });
    const currentEnd = endOfWeek(now, { weekStartsOn: 1 });
    const prevStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const prevEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

    const [currentTx, prevTx] = await Promise.all([
      this.queryByDateRange(currentStart, currentEnd),
      this.queryByDateRange(prevStart, prevEnd),
    ]);

    const current = this.calculateStats(currentTx);
    const previous = this.calculateStats(prevTx);

    return {
      current: {
        periode: `${format(currentStart, "dd")} - ${format(currentEnd, "dd MMM yyyy")}`,
        chiffreAffaires: current.ca,
        coutVentes: current.cout,
        margeBrute: current.marge,
        margePourcentage: `${current.margePourcentage}%`,
      },
      previous: {
        periode: `${format(prevStart, "dd")} - ${format(prevEnd, "dd MMM yyyy")}`,
        chiffreAffaires: previous.ca,
        coutVentes: previous.cout,
        margeBrute: previous.marge,
        margePourcentage: `${previous.margePourcentage}%`,
      },
      variation: {
        ca: this.getVariation(current.ca, previous.ca),
        cout: this.getVariation(current.cout, previous.cout),
        marge: this.getVariation(current.marge, previous.marge),
      },
    };
  }

  // BILAN MENSUEL
  static async getBilanMensuel(): Promise<BilanResponse> {
    const now = new Date();
    const currentStart = startOfMonth(now);
    const currentEnd = endOfMonth(now);
    const prevStart = startOfMonth(subMonths(now, 1));
    const prevEnd = endOfMonth(subMonths(now, 1));

    const [currentTx, prevTx] = await Promise.all([
      this.queryByDateRange(currentStart, currentEnd),
      this.queryByDateRange(prevStart, prevEnd),
    ]);

    const current = this.calculateStats(currentTx);
    const previous = this.calculateStats(prevTx);

    return {
      current: {
        periode: format(currentStart, "MMMM yyyy"),
        chiffreAffaires: current.ca,
        coutVentes: current.cout,
        margeBrute: current.marge,
        margePourcentage: `${current.margePourcentage}%`,
      },
      previous: {
        periode: format(prevStart, "MMMM yyyy"),
        chiffreAffaires: previous.ca,
        coutVentes: previous.cout,
        margeBrute: previous.marge,
        margePourcentage: `${previous.margePourcentage}%`,
      },
      variation: {
        ca: this.getVariation(current.ca, previous.ca),
        cout: this.getVariation(current.cout, previous.cout),
        marge: this.getVariation(current.marge, previous.marge),
      },
    };
  }

  // BILAN ANNUEL
  static async getBilanAnnuel(): Promise<BilanResponse> {
    const now = new Date();
    const currentStart = startOfYear(now);
    const currentEnd = endOfYear(now);
    const prevStart = startOfYear(subYears(now, 1));
    const prevEnd = endOfYear(subYears(now, 1));

    const [currentTx, prevTx] = await Promise.all([
      this.queryByDateRange(currentStart, currentEnd),
      this.queryByDateRange(prevStart, prevEnd),
    ]);

    const current = this.calculateStats(currentTx);
    const previous = this.calculateStats(prevTx);

    return {
      current: {
        periode: currentStart.getFullYear().toString(),
        chiffreAffaires: current.ca,
        coutVentes: current.cout,
        margeBrute: current.marge,
        margePourcentage: `${current.margePourcentage}%`,
      },
      previous: {
        periode: prevStart.getFullYear().toString(),
        chiffreAffaires: previous.ca,
        coutVentes: previous.cout,
        margeBrute: previous.marge,
        margePourcentage: `${previous.margePourcentage}%`,
      },
      variation: {
        ca: this.getVariation(current.ca, previous.ca),
        cout: this.getVariation(current.cout, previous.cout),
        marge: this.getVariation(current.marge, previous.marge),
      },
    };
  }
}

export default FinanceLocalService;