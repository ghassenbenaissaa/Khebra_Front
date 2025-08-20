export class DemandeCommunication {
  expertEmail: string;
  timestamp: Date;
  message: string;
  status: StatusDemande;  // using the clean string literal type
  id: number;
  conversationId: number;
}

export type StatusDemande = 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE' | 'ACHEVÉE' | 'COMMENTÉE';
