export class CreateBillRoomDto {
  room: string;
  bill: string;
  waterPriceRate: number;
  waterMeter: number;
  waterTotalPrice: number;
  lightPriceRate: number;
  electricMeter: number;
  lightTotalPrice: number;
  totalPrice: number;
  paider: string;
  paidEvidenceImage: string;
  isPaid: boolean;
  paidDate: Date;
  created_at: Date;
  updated_at: Date;
}
