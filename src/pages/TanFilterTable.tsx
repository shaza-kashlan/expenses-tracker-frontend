import React, {useState} from 'react'

import './index.css'

import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type SortingFn,
  type Table,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
} from '@tanstack/react-table'

import {
  type RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

type Expense = {
	description: string
	amount: number
	date: string
	payment_method: string
}

const myData = [
    {
        "_id": "660d67ada9de44c5a8b6ca2a",
        "description": "some expense",
        "amount": 12.2,
        "date": "2024-04-01",
        "payment_method": "cash",
        "tags": [],
        "__v": 0
    },
    {
        "_id": "660ebf21cfb20fbb8fb74669",
        "description": "PayPal Europe S.a.r.l. et Cie S.C.A 1033515140395/. CJS SALES + SERVICE S LIMITED, Ihr Einkauf bei CJS SALE S + SERVICES LIMITED End-to-End-Ref.: 1033515140395 Mandatsref: 532J224MHMP94 Gläubiger-ID: LU96ZZZ0000000000000000058 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -42.6,
        "date": "2024-04-02",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.988Z",
        "updatedAt": "2024-04-04T14:54:25.988Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7466a",
        "description": "AMAZON PAYMENTS EUROPE S.C.A. 303-0021792-4298774 AMZN Mktp DE 36 5NKWA5TRT821LF End-to-End-Ref.: 365NKWA5TRT821LF Mandatsref: E6ub:4K20:ri8K7U8iTmDoh4BM5HVN Gläubiger-ID: DE94ZZZ00000561653 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -15.35,
        "date": "2024-04-03",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.988Z",
        "updatedAt": "2024-04-04T14:54:25.988Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7466b",
        "description": "Holmes Place Health Beitragszahlung fuer: Adrian Doonan End-to-End-Ref.: PRDE004800001558160009 Mandatsref: DE004800001558160001 Gläubiger-ID: DE5004800000167073 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -84.9,
        "date": "2024-04-04",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.988Z",
        "updatedAt": "2024-04-04T14:54:25.988Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7466c",
        "description": "AKTION TIER - MENSCH 541301767016  Mitgliedsnummer Beitrag 2024.04 - 2024.09    Glaeub iger-ID DE42ZZZ00000685585 AKTIONTI ER E.V. End-to-End-Ref.: PR01043638-1-10357 Mandatsref: 541301767016 Gläubiger-ID: DE42ZZZ00000685585 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -24,
        "date": "2024-04-05",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.988Z",
        "updatedAt": "2024-04-04T14:54:25.988Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7466d",
        "description": "Allianz Versicherungs-AG Vertrag AS-1399008518 Hausratversicherung Eisenbahnstr. 19, 10997 Berlin 29.04.24 - 28.05.24 End-to-End-Ref.: AB224086-E04631907 Mandatsref: SA01A000000014237993 Gläubiger-ID: DE10ZZZ00000051878 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -12.15,
        "date": "2024-04-06",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.988Z",
        "updatedAt": "2024-04-04T14:54:25.988Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7466e",
        "description": "Rechnungsabschluss Konto 4038511600 EUR BLZ   120 800 00 vom 31.12.2023 bis 31.03.2024 Saldo nach Abschluss                    45.353,43  EUR w/ Genehmigung des Abschlusses",
        "amount": 0,
        "date": "2024-04-07",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.988Z",
        "updatedAt": "2024-04-04T14:54:25.988Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7466f",
        "description": "Kontoführung Konto 4038511600 EUR BLZ   120 800 00 vom 01.03.2024 bis 31.03.2024 Kontoführung            4,90- EUR",
        "amount": -4.9,
        "date": "2024-04-07",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.988Z",
        "updatedAt": "2024-04-04T14:54:25.988Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74670",
        "description": "Bundesagentur für Arbeit-Service-Ha us 962D148761/96201/7004 01.03.24-31.0 3.24 265001635467/1030010033834 End-to-End-Ref.: 265001635467 Kundenreferenz: NSCT2403270017550000000000000000002",
        "amount": 1969.8,
        "date": "2024-04-08",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.988Z",
        "updatedAt": "2024-04-04T14:54:25.988Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74671",
        "description": "PayPal Europe S.a.r.l. et Cie S.C.A 1033335457129/PP.3945.PP/. Prestige  Gifting Ltd, Ihr Einkauf bei Prest ige Gifting Ltd End-to-End-Ref.: 1033335457129 Mandatsref: 532J224MHMP94 Gläubiger-ID: LU96ZZZ0000000000000000058 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -50.44,
        "date": "2024-04-09",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74672",
        "description": "EDEKA Treugut 4247//BERLIN/DE 2024-03-22T12:56:24 KFN 0  VJ 2612 Kartenzahlung",
        "amount": -120.3,
        "date": "2024-04-10",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74673",
        "description": "Telefonica Germany GmbH + Co. OHG Kd-Nr.: 6003295885, Rg-Nr.: 1946232 821/7, Ihre Tarifrechnung End-to-End-Ref.: 3204050096220001946232821007RCUR Mandatsref: T0010001B000006003295885 Gläubiger-ID: DE9700000000142462 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -54.97,
        "date": "2024-04-01",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74674",
        "description": "BARCLAYS BANK PLC, BARCLAYC BARCDEHAXXX DE60201306002004954844 2004954844 End-to-End-Ref.: MOB.82.UE.59566",
        "amount": -843.97,
        "date": "2024-04-03",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74675",
        "description": "PayPal Europe S.a.r.l. et Cie S.C.A 1033259313839/PP.3945.PP/. PWRFC, I hr Einkauf bei PWRFC End-to-End-Ref.: 1033259313839 Mandatsref: 532J224MHMP94 Gläubiger-ID: LU96ZZZ0000000000000000058 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -50.48,
        "date": "2024-04-07",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74676",
        "description": "irc deutschland IRC End-to-End-Ref.: STR16NAPKDIISJYR2RIHARANBX5A9HDXMV Mandatsref: ZSUSDZEYSAOYYQ1E Gläubiger-ID: BE39ZZZCITD000000037 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -10,
        "date": "2024-04-02",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74677",
        "description": "eprimo GmbH eprimo sagt danke End-to-End-Ref.: Beleg 084031894078 Mandatsref: 43986544 Gläubiger-ID: DE12ZZZ00000080651 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -47,
        "date": "2024-04-13",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74678",
        "description": "ADRIAN DOONAN DRESDEFF120 DE26120800000038511601 End-to-End-Ref.: NOTPROVIDED Dauerauftrag",
        "amount": -100,
        "date": "2024-04-14",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74679",
        "description": "EDEKA Treugut 4247//BERLIN/DE 2024-03-07T13:45:38 KFN 0  VJ 2612 Kartenzahlung",
        "amount": -239.1,
        "date": "2024-04-01",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7467a",
        "description": "Yorck Kinogruppe LJZLT-KSGTH Yorck Unli End-to-End-Ref.: STR16NAPG7NGUSYYNYGDPRAN4WUFWCITSB Mandatsref: 615c3a-803518-5abb0b-ff123f Gläubiger-ID: BE39ZZZCITD000000037 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -19.9,
        "date": "2024-04-05",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7467b",
        "description": "WEG Eisenbahnstr. 19 Berlin XC2536620, 029, 03/24 Hausgeld 240, 00 Euro / Rucklagen 134,00 Euro, Ad rian Doonan End-to-End-Ref.: 960180 Mandatsref: 10.4000.2901 Gläubiger-ID: DE96WEG00001004034 Änderung Mandatsreferenz SEPA-BASIS-LASTSCHRIFT",
        "amount": -374,
        "date": "2024-04-07",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7467c",
        "description": "Holmes Place Health Beitragszahlung fuer: Adrian Doonan End-to-End-Ref.: PRDE004800001558160007 Mandatsref: DE004800001558160001 Gläubiger-ID: DE5004800000167073 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -84.9,
        "date": "2024-04-03",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7467d",
        "description": "Allianz Versicherungs-AG Vertrag AS-1399008518 Hausratversicherung Eisenbahnstr. 19, 10997 Berlin 29.03.24 - 28.04.24 End-to-End-Ref.: AB224058-E01900599 Mandatsref: SA01A000000014237993 Gläubiger-ID: DE10ZZZ00000051878 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -12.15,
        "date": "2024-04-09",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7467e",
        "description": "Kontoführung Konto 4038511600 EUR BLZ   120 800 00 vom 01.02.2024 bis 29.02.2024 Kontoführung            4,90- EUR",
        "amount": -4.9,
        "date": "2024-04-10",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7467f",
        "description": "Bundesagentur für Arbeit-Service-Ha us 962D148761/96201/7004 01.02.24-29.0 2.24 072057875120/1030010033834 End-to-End-Ref.: 072057875120 Kundenreferenz: NSCT2402280006220000000000000000001",
        "amount": 1969.8,
        "date": "2024-04-05",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74680",
        "description": "BARCLAYS BANK PLC, BARCLAYC BARCDEHAXXX DE60201306002004954844 2004954844 End-to-End-Ref.: MOB.54.UE.21420",
        "amount": -761.43,
        "date": "2024-04-01",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74681",
        "description": "Telefonica Germany GmbH + Co. OHG Kd-Nr.: 6003295885, Rg-Nr.: 1925082 498/7, Ihre Tarifrechnung End-to-End-Ref.: 3204027263460001925082498007RCUR Mandatsref: T0010001B000006003295885 Gläubiger-ID: DE9700000000142462 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -55.42,
        "date": "2024-04-02",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74682",
        "description": "irc deutschland IRC End-to-End-Ref.: STR16NAPZBC5M12EM9W2KRANHEVGKPKLQC Mandatsref: D6N0XMN0SCQILW2I Gläubiger-ID: BE39ZZZCITD000000037 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -10,
        "date": "2024-04-08",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74683",
        "description": "PayPal Europe S.a.r.l. et Cie S.C.A 1032626223827/PP.3945.PP/. , Ihr Ei nkauf bei End-to-End-Ref.: 1032626223827 Mandatsref: 532J224MHMP94 Gläubiger-ID: LU96ZZZ0000000000000000058 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -35,
        "date": "2024-04-02",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74684",
        "description": "WEG Eisenbahnstr. 19 Berlin XC2235545, 029, 02/24 Hausgeld 240, 00 Euro / Rucklagen 134,00 Euro, Ad rian Doonan End-to-End-Ref.: 874423 Mandatsref: 10.4000.2901 Gläubiger-ID: DE96WEG00001004034 Änderung Mandatsreferenz SEPA-BASIS-LASTSCHRIFT",
        "amount": -374,
        "date": "2024-04-11",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74685",
        "description": "WEG Eisenbahnstr. 19 Berlin XC2084305, 029, 01/24 Korrektur Wir tschaftsplan 2024, Adrian Doonan End-to-End-Ref.: 821116 Mandatsref: 10.4000.2901 Gläubiger-ID: DE96WEG00001004034 Änderung Mandatsreferenz SEPA-BASIS-LASTSCHRIFT",
        "amount": -100,
        "date": "2024-04-12",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.989Z",
        "updatedAt": "2024-04-04T14:54:25.989Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74686",
        "description": "eprimo GmbH eprimo sagt danke End-to-End-Ref.: Beleg 089029748387 Mandatsref: 43986544 Gläubiger-ID: DE12ZZZ00000080651 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -47,
        "date": "2024-04-01",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.990Z",
        "updatedAt": "2024-04-04T14:54:25.990Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74687",
        "description": "ADRIAN DOONAN DRESDEFF120 DE26120800000038511601 End-to-End-Ref.: NOTPROVIDED Dauerauftrag",
        "amount": -100,
        "date": "2024-04-08",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.990Z",
        "updatedAt": "2024-04-04T14:54:25.990Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74688",
        "description": "Datenschutzhinweis ab 28.02.2024: Wir übermitteln Überweisungsdaten an den Zahlungsdienstleister des Empfängers (ZDE). Eingeschaltete Dienstleister können erforderliche Prüfungen zur Verhinderung von Zah- lungsverkehrsbetrug vornehmen. Der ZDE kann dem Empfänger die Über- weisungsdaten zur Verfügung stel- len (auch IBAN). Bei grenzüberschr. Überweisungen und Eilüberweisungen im Inland können die Daten in ge- meinsamer Verantwortung mit SWIFT verarbeitet werden. Zur System- sicherheit speichert SWIFT die Daten vorübergehend in Rechenzen- zentren in der EU, Schweiz und USA. Informationen und Vertrag über die gemeinsame Verantwortung zum SWIFT- Transaktionsverarbeitungsdienst: https://www.commerzbank.de/ hinweise/rechtliche-hinweise/",
        "amount": 0,
        "date": "2024-04-08",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.990Z",
        "updatedAt": "2024-04-04T14:54:25.990Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb74689",
        "description": "AMAZON PAYMENTS EUROPE S.C.A. 302-9253316-5261961 AMZN Mktp DE 20 MSIVTG9JCNBUA7 End-to-End-Ref.: 20MSIVTG9JCNBUA7 Mandatsref: E6ub:4K20:ri8K7U8iTmDoh4BM5HVN Gläubiger-ID: DE94ZZZ00000561653 SEPA-BASISLASTSCHRIFT wiederholend",
        "amount": -63.99,
        "date": "2024-04-01",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.990Z",
        "updatedAt": "2024-04-04T14:54:25.990Z"
    },
    {
        "_id": "660ebf21cfb20fbb8fb7468a",
        "description": "LIDL SAGT DANKE//Berlin-Neukoelln/D 2024-02-10T19:10:46 KFN 0  VJ 2612 Auszahlung 100,00EUR Kartenzahlung mit Bar-Ausz.",
        "amount": -132.62,
        "date": "2024-04-11",
        "payment_method": "bank_statement",
        "tags": [],
        "__v": 0,
        "createdAt": "2024-04-04T14:54:25.990Z",
        "updatedAt": "2024-04-04T14:54:25.990Z"
    },
]

function TanFilterTable() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')

  const columnHelper = createColumnHelper<Expense>()
  const columns = React.useMemo<ColumnDef<Expense, any>[]>(
    () => [
    columnHelper.accessor('date', {
		cell: info => info.getValue(),
		footer: info => info.column.id,
		sortDescFirst: false,
		sortingFn: 'datetime',
	}),
	columnHelper.accessor('description', {
		cell: info => `${info.getValue().slice(0,25)} ...`,
		footer: info => info.column.id
	}),
	columnHelper.accessor('amount', {
		cell: info => `${info.getValue().toFixed(2)} €`,
		footer: info => info.column.id,
		sortingFn: 'basic',
	}),
	columnHelper.accessor('payment_method', {
		cell: info => {
			const value = info.getValue();
			if (value === "bank_statement") {
				return "Bank"
			}
			if (value === "credit_card_statement") {
				return "Credit"
			}
			if (value === "cash") {
				return "Cash"
			}
			return value
		},
		footer: info => info.column.id
	})
    ],
    []
  )

  const [data, setData] = React.useState<Expense[]>(myData)
  const refreshData = () => setData(myData)

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    initialState: {
        sorting: [
          {
            id: 'date',
            desc: true, // sort by name in descending order by default
          },
        ],
      },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })


  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'date') {
      if (table.getState().sorting[0]?.id !== 'date') {
        table.setSorting([{ id: 'date', desc: true }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

  return (
    <div className="p-2">
      <div>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search all columns..."
        />
      </div>
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
         type="button"
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
         type="button"
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
         type="button"
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          type="button"
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
      <div>
        <button  type="button" onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button  type="button" onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
    </div>
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>
  table: Table<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={`${column.id}list`}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={`${column.id}list`}
      />
      <div className="h-1" />
    </>
  )
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}


export default TanFilterTable;