/* ___ shadow sheet __________________________________
    This file is were We declare shadow, so that we 
    dont have to recreate shadows throughout the app-
    lication.
   ____________________________________________________*/

export const shadows = {
  card: { boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 12px 30px -12px rgba(0,0,0,0.08)' },
  subtle: { boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
} as const;
