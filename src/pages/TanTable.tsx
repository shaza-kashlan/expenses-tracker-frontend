import { useEffect, useState, useReducer } from "react";
import axios from "axios";
import { API_URL } from "../App";

import {   
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	SortingState,
	getFilteredRowModel } from '@tanstack/react-table'




type Person = {
	firstName: string
	lastName: string
	age: number
	visits: number
	progress: number
	status: string
	}

type Expense = {
	description: string
	amount: number
	date: Date
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
	
const columnHelper = createColumnHelper<Person>()

const columns = [
	columnHelper.accessor('date', {
		cell: info => info.getValue(),
		footer: info => info.column.id,
		sortDescFirst: true,
		sortingFn: 'datetime',
	}),
	columnHelper.accessor('description', {
		cell: info => info.getValue().slice(0,25) + ' ...',
		footer: info => info.column.id
	}),
	columnHelper.accessor('amount', {
		cell: info => info.getValue().toFixed(2) + " €",
		footer: info => info.column.id
	}),
	columnHelper.accessor('payment_method', {
		cell: info => info.getValue(),
		footer: info => info.column.id
	})
]

const columnsOrig = [
	columnHelper.accessor('firstName', {
		cell: info => info.getValue(),
		footer: info => info.column.id,
	}),
	columnHelper.accessor(row => row.lastName, {
		id: 'lastName',
		cell: info => <i>{info.getValue()}</i>,
		header: () => <span>Last Name</span>,
		footer: info => info.column.id,
	}),
	columnHelper.accessor('age', {
		header: () => 'Age',
		cell: info => info.renderValue(),
		footer: info => info.column.id,
	}),
	columnHelper.accessor('visits', {
		header: () => <span>Visits</span>,
		footer: info => info.column.id,
	}),
	columnHelper.accessor('status', {
		header: 'Status',
		footer: info => info.column.id,
	}),
	columnHelper.accessor('progress', {
		header: 'Profile Progress',
		footer: info => info.column.id,
	}),
]

const TanTable = () => {

	const [data, _setData] = useState(() => [...myData])
	const rerender = useReducer(() => ({}), {})[1]
	const [sorting, setSorting] = useState<SortingState>([])


	// useEffect(() => {
	// 	const getExpenses = async () => {
	// 		const token = localStorage.getItem("accessToken");
	// 		const expenses = await axios.get(`${API_URL}/expenses`, {
	// 			headers: { Authorization: `Bearer ${token}` },
	// 		});
	// 		console.log(expenses.data);
	// 		console.log(`got ${expenses.data.length} expenses`);
	// 		setRowData(expenses.data);
	// 		return;
	// 	};
	// 	//getExpenses();
	// }, []);

const table = useReactTable({
	data,
	columns,
	state: {
		sorting,
	  },
	onSortingChange: setSorting,
	getCoreRowModel: getCoreRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
})

return (
	<div className="p-2">
		<table>
		<thead>
			{table.getHeaderGroups().map(headerGroup => (
			<tr key={headerGroup.id}>
				{headerGroup.headers.map(header => (
				<th key={header.id}>
					{header.isPlaceholder
					? null
					: (
					<div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
						>
                      {flexRender(
						header.column.columnDef.header,
						header.getContext()
						)}                        {{
							asc: ' 🔼',
							desc: ' 🔽',
						  }[header.column.getIsSorted() as string] ?? null}</div>)}
				</th>
				))}
			</tr>
			))}
		</thead>
		<tbody>
			{table.getRowModel().rows.map(row => (
			<tr key={row.id}>
				{row.getVisibleCells().map(cell => (
				<td key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</td>
				))}
			</tr>
			))}
		</tbody>
		<tfoot>
			{table.getFooterGroups().map(footerGroup => (
			<tr key={footerGroup.id}>
				{footerGroup.headers.map(header => (
				<th key={header.id}>
					{header.isPlaceholder
					? null
					: flexRender(
						header.column.columnDef.footer,
						header.getContext()
						)}
				</th>
				))}
			</tr>
			))}
		</tfoot>
		</table>
		<div className="h-4" />
		<button onClick={() => rerender()} className="border p-2">
		Rerender
		</button>
	</div>
	)
};
export default TanTable;
