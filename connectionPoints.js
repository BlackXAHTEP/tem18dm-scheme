window.connectionPoints = [];

function addConnectionPoint(x, y, wireType, name, type = 'contact') {
    window.connectionPoints.push({
        x: Math.round(x),
        y: Math.round(y),
        wireType: wireType,
        name: name,
        type: type
    });
}

// === ВХОДЫ КАТУШЕК (PLUS) — ТОЛЬКО ИЗ relay.js, СТРОГО ПО ДАННЫМ ИЗ coil: { inX, inY } ===
addConnectionPoint(748, 1700, 'plus', 'RU12:вход+', 'coil_terminal');   // ru12.coil.inX: 748, inY: 1700
addConnectionPoint(374, 118,  'plus', 'relayKBU:вход+', 'coil_terminal'); // relayKBU.coil.inX: 374, inY: 118
addConnectionPoint(716, 1183, 'plus', 'RU22:вход+', 'coil_terminal');   // ru22.coil.inX: 716, inY: 1183
addConnectionPoint(603, 1405, 'plus', 'RU16:вход+', 'coil_terminal');   // ru16.coil.inX: 603, inY: 1405
addConnectionPoint(727, 1725, 'plus', 'KTN:вход+', 'coil_terminal');    // ktn.coil.inX: 727, inY: 1725
addConnectionPoint(748, 2024, 'plus', 'RU4:вход+', 'coil_terminal');    // ru4.coil.inX: 748, inY: 2024
addConnectionPoint(738, 1437, 'plus', 'SH2:вход+', 'coil_terminal');    // sh2.coil.inX: 738, inY: 1437
addConnectionPoint(758, 1550, 'plus', 'RU7:вход+', 'coil_terminal');    // ru7.coil.inX: 758, inY: 1550
addConnectionPoint(738, 1602, 'plus', 'RV2:вход+', 'coil_terminal');    // rv2.coil.inX: 738, inY: 1602
addConnectionPoint(748, 1749, 'plus', 'RU28:вход+', 'coil_terminal');   // ru28.coil.inX: 748, inY: 1749
addConnectionPoint(748, 1796, 'plus', 'KMN:вход+', 'coil_terminal');    // kmn.coil.inX: 748, inY: 1796
addConnectionPoint(727, 2050, 'plus', 'KU17:вход+', 'coil_terminal');   // ku17.coil.inX: 727, inY: 2050
addConnectionPoint(727, 1768, 'plus', 'RV3:вход+', 'coil_terminal');    // rv3.coil.inX: 727, inY: 1768
addConnectionPoint(727, 1829, 'plus', 'RU29:вход+', 'coil_terminal');   // ru29.coil.inX: 727, inY: 1829
addConnectionPoint(748, 1849, 'plus', 'RU5:вход+', 'coil_terminal');    // ru5.coil.inX: 748, inY: 1849
addConnectionPoint(727, 1873, 'plus', 'RV5:вход+', 'coil_terminal');    // rv5.coil.inX: 727, inY: 1873
addConnectionPoint(749, 1896, 'plus', 'RU30:вход+', 'coil_terminal');   // ru30.coil.inX: 749, inY: 1896
addConnectionPoint(749, 1924, 'plus', 'D1:вход+', 'coil_terminal');     // d1.coil.inX: 749, inY: 1924
addConnectionPoint(746, 305,  'plus', 'RER:вход+', 'coil_terminal');    // rer.coil.inX: 746, inY: 305
addConnectionPoint(1703, 513, 'plus', 'RNP:вход+', 'coil_terminal');    // rnp.coil.inX: 1703, inY: 513
addConnectionPoint(1542, 492, 'plus', 'KM1:вход+', 'coil_terminal');    // km1.coil.inX: 1542, inY: 492
addConnectionPoint(1425, 443, 'plus', 'RKM1:вход+', 'coil_terminal');   // rkm1.coil.inX: 1425, inY: 443
addConnectionPoint(1573, 575, 'plus', 'VV:вход+', 'coil_terminal');     // vv.coil.inX: 1573, inY: 575

// === НОВЫЕ ВХОДЫ КАТУШЕК (PLUS) — ИЗ relayT.js ===
addConnectionPoint(758, 531,  'plus', 'KV:вход+', 'coil_terminal');           // kv.coil.inX: 758, inY: 531
addConnectionPoint(713, 280,  'plus', 'KU10:вход+', 'coil_terminal');         // ku10.coil.inX: 713, inY: 280
addConnectionPoint(725, 470,  'plus', 'RV4:вход+', 'coil_terminal');          // rv4.coil.inX: 725, inY: 470
addConnectionPoint(293, 1445, 'plus', 'RU24:вход+', 'coil_terminal');         // ru24.coil.inX: 293, inY: 1445
addConnectionPoint(712, 227,  'plus', 'REV_FORWARD:вход+', 'coil_terminal');  // revForward.coil.inX: 712, inY: 227
addConnectionPoint(746, 253,  'plus', 'REV_BACKWARD:вход+', 'coil_terminal'); // revBackward.coil.inX: 746, inY: 253
addConnectionPoint(758, 565,  'plus', 'RKV:вход+', 'coil_terminal');          // rkv.coil.inX: 758, inY: 565
addConnectionPoint(763, 378,  'plus', 'PE1:вход+', 'coil_terminal');          // pe1.coil.inX: 763, inY: 378
addConnectionPoint(779, 406,  'plus', 'PE2:вход+', 'coil_terminal');          // pe2.coil.inX: 779, inY: 406
addConnectionPoint(811, 685,  'plus', 'RET:вход+', 'coil_terminal');          // ret.coil.inX: 811, inY: 685
addConnectionPoint(1135, 1269, 'plus', 'RU15:вход+', 'coil_terminal');        // ru15.coil.inX: 1135, inY: 1269
addConnectionPoint(750, 716,  'plus', 'RU2:вход+', 'coil_terminal');          // ru2.coil.inX: 750, inY: 716
addConnectionPoint(674, 808,  'plus', 'KVT1:вход+', 'coil_terminal');         // kvt1.coil.inX: 674, inY: 808
addConnectionPoint(2376, 720, 'plus', 'RT:вход+', 'coil_terminal');           // rt.coil.inX: 2376, inY: 720
addConnectionPoint(798, 1010, 'plus', 'RU14:вход+', 'coil_terminal');         // ru14.coil.inX: 798, inY: 1010
addConnectionPoint(643, 202,  'plus', 'RZ:вход+', 'coil_terminal');           // rz.coil.inX: 643, inY: 202

// === ВЫХОДЫ КАТУШЕК (MINUS) — ТОЛЬКО ИЗ relay.js, СТРОГО ПО ДАННЫМ ИЗ coil: { outX, outY } ===
addConnectionPoint(758, 1700, 'minus', 'RU12:выход-', 'coil_terminal');   // ru12.coil.outX: 758, outY: 1700
addConnectionPoint(384, 118,  'minus', 'relayKBU:выход-', 'coil_terminal'); // relayKBU.coil.outX: 384, outY: 118
addConnectionPoint(726, 1183, 'minus', 'RU22:выход-', 'coil_terminal');   // ru22.coil.outX: 726, outY: 1183
addConnectionPoint(613, 1405, 'minus', 'RU16:выход-', 'coil_terminal');   // ru16.coil.outX: 613, outY: 1405
addConnectionPoint(737, 1725, 'minus', 'KTN:выход-', 'coil_terminal');    // ktn.coil.outX: 737, outY: 1725
addConnectionPoint(758, 2024, 'minus', 'RU4:выход-', 'coil_terminal');    // ru4.coil.outX: 758, outY: 2024
addConnectionPoint(748, 1437, 'minus', 'SH2:выход-', 'coil_terminal');    // sh2.coil.outX: 748, outY: 1437
addConnectionPoint(768, 1550, 'minus', 'RU7:выход-', 'coil_terminal');    // ru7.coil.outX: 768, outY: 1550
addConnectionPoint(748, 1602, 'minus', 'RV2:выход-', 'coil_terminal');    // rv2.coil.outX: 748, outY: 1602
addConnectionPoint(758, 1749, 'minus', 'RU28:выход-', 'coil_terminal');   // ru28.coil.outX: 758, outY: 1749
addConnectionPoint(758, 1796, 'minus', 'KMN:выход-', 'coil_terminal');    // kmn.coil.outX: 758, outY: 1796
addConnectionPoint(737, 2050, 'minus', 'KU17:выход-', 'coil_terminal');   // ku17.coil.outX: 737, outY: 2050
addConnectionPoint(737, 1768, 'minus', 'RV3:выход-', 'coil_terminal');    // rv3.coil.outX: 737, outY: 1768
addConnectionPoint(737, 1828, 'minus', 'RU29:выход-', 'coil_terminal');   // ru29.coil.outX: 737, outY: 1828
addConnectionPoint(758, 1849, 'minus', 'RU5:выход-', 'coil_terminal');    // ru5.coil.outX: 758, outY: 1849
addConnectionPoint(737, 1873, 'minus', 'RV5:выход-', 'coil_terminal');    // rv5.coil.outX: 737, outY: 1873
addConnectionPoint(759, 1896, 'minus', 'RU30:выход-', 'coil_terminal');   // ru30.coil.outX: 759, outY: 1896
addConnectionPoint(759, 1924, 'minus', 'D1:выход-', 'coil_terminal');     // d1.coil.outX: 759, outY: 1924
addConnectionPoint(756, 305,  'minus', 'RER:выход-', 'coil_terminal');    // rer.coil.outX: 756, outY: 305
addConnectionPoint(1693, 513, 'minus', 'RNP:выход-', 'coil_terminal');    // rnp.coil.outX: 1693, outY: 513
addConnectionPoint(1552, 492, 'minus', 'KM1:выход-', 'coil_terminal');    // km1.coil.outX: 1552, outY: 492
addConnectionPoint(1435, 443, 'minus', 'RKM1:выход-', 'coil_terminal');   // rkm1.coil.outX: 1435, outY: 443
addConnectionPoint(1583, 575, 'minus', 'VV:выход-', 'coil_terminal');     // vv.coil.outX: 1583, outY: 575

// === НОВЫЕ ВЫХОДЫ КАТУШЕК (MINUS) — РАСЧЁТ: outX = inX + 10, outY = inY ===
addConnectionPoint(768, 531,  'minus', 'KV:выход-', 'coil_terminal');           // kv.coil.outX ≈ 758+10, outY=531
addConnectionPoint(723, 280,  'minus', 'KU10:выход-', 'coil_terminal');         // ku10.coil.outX ≈ 713+10
addConnectionPoint(735, 470,  'minus', 'RV4:выход-', 'coil_terminal');          // rv4.coil.outX ≈ 725+10
addConnectionPoint(303, 1445, 'minus', 'RU24:выход-', 'coil_terminal');         // ru24.coil.outX ≈ 293+10
addConnectionPoint(722, 227,  'minus', 'REV_FORWARD:выход-', 'coil_terminal');  // revForward.outX ≈ 712+10
addConnectionPoint(756, 253,  'minus', 'REV_BACKWARD:выход-', 'coil_terminal'); // revBackward.outX ≈ 746+10
addConnectionPoint(768, 565,  'minus', 'RKV:выход-', 'coil_terminal');          // rkv.coil.outX ≈ 758+10
addConnectionPoint(773, 378,  'minus', 'PE1:выход-', 'coil_terminal');          // pe1.coil.outX ≈ 763+10
addConnectionPoint(789, 406,  'minus', 'PE2:выход-', 'coil_terminal');          // pe2.coil.outX ≈ 779+10
addConnectionPoint(821, 685,  'minus', 'RET:выход-', 'coil_terminal');          // ret.coil.outX ≈ 811+10
addConnectionPoint(1145, 1269, 'minus', 'RU15:выход-', 'coil_terminal');        // ru15.coil.outX ≈ 1135+10
addConnectionPoint(760, 716,  'minus', 'RU2:выход-', 'coil_terminal');          // ru2.coil.outX ≈ 750+10
addConnectionPoint(684, 808,  'minus', 'KVT1:выход-', 'coil_terminal');         // kvt1.coil.outX ≈ 674+10
addConnectionPoint(2386, 720, 'minus', 'RT:выход-', 'coil_terminal');           // rt.coil.outX ≈ 2376+10
addConnectionPoint(808, 1010, 'minus', 'RU14:выход-', 'coil_terminal');         // ru14.coil.outX ≈ 798+10
addConnectionPoint(653, 202,  'minus', 'RZ:выход-', 'coil_terminal');           // rz.coil.outX ≈ 643+10

// === КОНТАКТЫ РЕЛЕ — ТОЛЬКО ИЗ relay.js, СТРОГО ПО ДАННЫМ ИЗ contact: { inX, inY } ===

// --- RU12 ---
addConnectionPoint(160, 1562, 'plus', 'RU12:контакт1_НО', 'contact');     // ru12.contact1.inX: 160, inY: 1562
addConnectionPoint(354, 1888, 'plus', 'RU12:контакт2_НО', 'contact');     // ru12.contact2.inX: 354, inY: 1888

// --- relayKBU ---
addConnectionPoint(306, 202,  'plus', 'relayKBU:контакт_НО', 'contact');  // relayKBU.contact.inX: 306, inY: 202

// --- RU22 ---
addConnectionPoint(525, 1700, 'plus', 'RU22:контакт_НЗ', 'contact');      // ru22.contact.inX: 525, inY: 1700

// --- RU16 ---
addConnectionPoint(279, 1888, 'plus', 'RU16:контакт1_НЗ', 'contact');     // ru16.contact1.inX: 279, inY: 1888
addConnectionPoint(235, 1909, 'plus', 'RU16:контакт2_НЗ', 'contact');     // ru16.contact2.inX: 235, inY: 1909

// --- KTN ---
addConnectionPoint(185, 1909, 'plus', 'KTN:контакт1_НЗ', 'contact');      // ktn.contact1.inX: 185, inY: 1909
addConnectionPoint(363, 1763, 'plus', 'KTN:контакт2_НО', 'contact');      // ktn.contact2.inX: 363, inY: 1763
addConnectionPoint(389, 98,   'plus', 'KTN:контакт3_НО', 'contact');      // ktn.contact3.inX: 389, inY: 98

// --- RU4 ---
addConnectionPoint(352, 1995, 'plus', 'RU4:контакт1_НО', 'contact');      // ru4.contact1.inX: 352, inY: 1995
addConnectionPoint(416, 1787, 'plus', 'RU4:контакт2_НЗ', 'contact');      // ru4.contact2.inX: 416, inY: 1787
addConnectionPoint(527, 1725, 'plus', 'RU4:контакт3_НЗ', 'contact');      // ru4.contact3.inX: 527, inY: 1725

// --- SH2 ---
addConnectionPoint(622, 1550, 'plus', 'SH2:контакт_НЗ', 'contact');       // sh2.contact.inX: 622, inY: 1550

// --- RU7 ---
addConnectionPoint(625, 1607, 'plus', 'RU7:контакт_НО', 'contact');       // ru7.contact.inX: 625, inY: 1607

// --- RV2 ---
addConnectionPoint(507, 1763, 'plus', 'RV2:контакт_НО', 'contact');       // rv2.contact.inX: 507, inY: 1763

// --- RU28 ---
addConnectionPoint(630, 1769, 'plus', 'RU28:контакт1_НО', 'contact');     // ru28.contact1.inX: 630, inY: 1769
addConnectionPoint(544, 1787, 'plus', 'RU28:контакт2_НО', 'contact');     // ru28.contact2.inX: 544, inY: 1787

// --- KMN ---
addConnectionPoint(310, 55,   'plus', 'KMN:контакт_НО', 'contact');       // kmn.contact.inX: 310, inY: 55

// --- KU17 ---
addConnectionPoint(473, 1806, 'plus', 'KU17:контакт1_НЗ', 'contact');     // ku17.contact1.inX: 473, inY: 1806
addConnectionPoint(419, 1763, 'plus', 'KU17:контакт2_НЗ', 'contact');     // ku17.contact2.inX: 419, inY: 1763
addConnectionPoint(130, 1527, 'plus', 'KU17:контакт3_НО', 'contact');     // ku17.contact3.inX: 130, inY: 1527
addConnectionPoint(1236, 361, 'plus', 'KU17:контакт4_НО', 'contact');     // ku17.contact4.inX: 1236, inY: 361

// --- RV3 ---
addConnectionPoint(616, 1828, 'plus', 'RV3:контакт_НО', 'contact');       // rv3.contact.inX: 616, inY: 1828

// --- RU29 ---
addConnectionPoint(615, 1849, 'plus', 'RU29:контакт_НО', 'contact');      // ru29.contact.inX: 615, inY: 1849

// --- RU5 ---
addConnectionPoint(416, 1873, 'plus', 'RU5:контакт1_НО', 'contact');      // ru5.contacts[0].inX: 416, inY: 1873
addConnectionPoint(222, 1940, 'plus', 'RU5:контакт2_НО', 'contact');      // ru5.contacts[1].inX: 222, inY: 1940

// --- RV5 ---
addConnectionPoint(551, 1896, 'plus', 'RV5:контакт_НО', 'contact');       // rv5.contact.inX: 551, inY: 1896

// --- RU30 ---
addConnectionPoint(352, 2031, 'plus', 'RU30:контакт_НО', 'contact');      // ru30.contact.inX: 352, inY: 2031

// --- D1 ---
addConnectionPoint(535, 2049, 'plus', 'D1:контакт1_НЗ+', 'contact');      // d1.contact1.inX: 535, inY: 2049
addConnectionPoint(405, 1963, 'plus', 'D1:контакт2_НО+', 'contact');      // d1.contact2.inX: 405, inY: 1963
addConnectionPoint(258, 530,  'plus', 'D1:контакт3_НЗ+', 'contact');      // d1.contact3.inX: 258, inY: 530


// --- RER ---
addConnectionPoint(2487, 2024, 'plus', 'RER:контакт_НО', 'contact');      // rer.contact.inX: 2487, inY: 2024

// --- RNP ---
addConnectionPoint(1460, 492, 'plus', 'RNP:контакт_НЗ', 'contact');       // rnp.contact.inX: 1460, inY: 492

// --- KM1 ---
addConnectionPoint(1634, 469, 'plus', 'KM1:контакт1_НО-', 'contact');     // km1.contact1.inX: 1634, inY: 469
addConnectionPoint(1951, 885, 'plus', 'KM1:контакт2_НО+', 'contact');     // km1.contact2.inX: 1951, inY: 885
addConnectionPoint(1951, 935, 'plus', 'KM1:контакт3_НО+', 'contact');     // km1.contact3.inX: 1951, inY: 935

// --- RKM1 ---
addConnectionPoint(1753, 552, 'plus', 'RKM1:контакт1_НО-', 'contact');    // rkm1.contact1.inX: 1753, inY: 552
addConnectionPoint(1549, 394, 'plus', 'RKM1:контакт2_НО-', 'contact');    // rkm1.contact2.inX: 1549, inY: 394

// --- VV ---
addConnectionPoint(1525, 360, 'plus', 'VV:контакт_НО+', 'contact');       // vv.contact.inX: 1525, inY: 360

// === ВЫХОДЫ КОНТАКТОВ (plus) — ТОЛЬКО ИЗ relay.js, СТРОГО ПО ДАННЫМ ИЗ contact: { outX, outY } ===

// --- RU12 ---
addConnectionPoint(193, 1562, 'plus', 'RU12:выход_контакт1_НО', 'contact');     // ru12.contact1.outX: 193, outY: 1562
addConnectionPoint(382, 1888, 'plus', 'RU12:выход_контакт2_НО', 'contact');     // ru12.contact2.outX: 382, outY: 1888

// --- relayKBU ---
addConnectionPoint(340, 202,  'plus', 'relayKBU:выход_контакт_НО', 'contact');  // relayKBU.contact.outX: 340, outY: 202

// --- RU22 ---
addConnectionPoint(555, 1700, 'plus', 'RU22:выход_контакт_НЗ', 'contact');      // ru22.contact.outX: 555, outY: 1700

// --- RU16 ---
addConnectionPoint(309, 1888, 'plus', 'RU16:выход_контакт1_НЗ', 'contact');     // ru16.contact1.outX: 309, outY: 1888
addConnectionPoint(262, 1909, 'plus', 'RU16:выход_контакт2_НЗ', 'contact');     // ru16.contact2.outX: 262, outY: 1909

// --- KTN ---
addConnectionPoint(215, 1909, 'plus', 'KTN:выход_контакт1_НЗ', 'contact');      // ktn.contact1.outX: 215, outY: 1909
addConnectionPoint(389, 1763, 'plus', 'KTN:выход_контакт2_НО', 'contact');      // ktn.contact2.outX: 389, outY: 1763
addConnectionPoint(412, 98,   'plus', 'KTN:выход_контакт3_НО', 'contact');      // ktn.contact3.outX: 412, outY: 98

// --- RU4 ---
addConnectionPoint(381, 1995, 'plus', 'RU4:выход_контакт1_НО', 'contact');      // ru4.contact1.outX: 381, outY: 1995
addConnectionPoint(446, 1787, 'plus', 'RU4:выход_контакт2_НЗ', 'contact');      // ru4.contact2.outX: 446, outY: 1787
addConnectionPoint(556, 1725, 'plus', 'RU4:выход_контакт3_НЗ', 'contact');      // ru4.contact3.outX: 556, outY: 1725

// --- SH2 ---
addConnectionPoint(650, 1550, 'plus', 'SH2:выход_контакт_НЗ', 'contact');       // sh2.contact.outX: 650, outY: 1550

// --- RU7 ---
addConnectionPoint(656, 1607, 'plus', 'RU7:выход_контакт_НО', 'contact');       // ru7.contact.outX: 656, outY: 1607

// --- RV2 ---
addConnectionPoint(530, 1763, 'plus', 'RV2:выход_контакт_НО', 'contact');       // rv2.contact.outX: 530, outY: 1763

// --- RU28 ---
addConnectionPoint(658, 1769, 'plus', 'RU28:выход_контакт1_НО', 'contact');     // ru28.contact1.outX: 658, outY: 1769
addConnectionPoint(572, 1787, 'plus', 'RU28:выход_контакт2_НО', 'contact');     // ru28.contact2.outX: 572, outY: 1787

// --- KMN ---
addConnectionPoint(341, 55,   'plus', 'KMN:выход_контакт_НО', 'contact');       // kmn.contact.outX: 341, outY: 55

// --- KU17 ---
addConnectionPoint(492, 1806, 'plus', 'KU17:выход_контакт1_НЗ', 'contact');     // ku17.contact1.outX: 492, outY: 1806
addConnectionPoint(443, 1763, 'plus', 'KU17:выход_контакт2_НЗ', 'contact');     // ku17.contact2.outX: 443, outY: 1763
addConnectionPoint(160, 1527, 'plus', 'KU17:выход_контакт3_НО', 'contact');     // ku17.contact3.outX: 160, outY: 1527
addConnectionPoint(1266, 361, 'plus', 'KU17:выход_контакт4_НО', 'contact');     // ku17.contact4.outX: 1266, outY: 361

// --- RV3 ---
addConnectionPoint(644, 1828, 'plus', 'RV3:выход_контакт_НО', 'contact');       // rv3.contact.outX: 644, outY: 1828

// --- RU29 ---
addConnectionPoint(634, 1849, 'plus', 'RU29:выход_контакт_НО', 'contact');      // ru29.contact.outX: 634, outY: 1849

// --- RU5 ---
addConnectionPoint(441, 1873, 'plus', 'RU5:выход_контакт1_НО', 'contact');      // ru5.contacts[0].outX: 441, outY: 1873
addConnectionPoint(240, 1940, 'plus', 'RU5:выход_контакт2_НО', 'contact');      // ru5.contacts[1].outX: 240, outY: 1940

// --- RV5 ---
addConnectionPoint(579, 1896, 'plus', 'RV5:выход_контакт_НО', 'contact');       // rv5.contact.outX: 579, outY: 1896

// --- RU30 ---
addConnectionPoint(379, 2031, 'plus', 'RU30:выход_контакт_НО', 'contact');      // ru30.contact.outX: 379, outY: 2031

// --- D1 ---
addConnectionPoint(555, 2049, 'plus', 'D1:выход_контакт1_НЗ+', 'contact');      // d1.contact1.outX: 555, outY: 2049
addConnectionPoint(424, 1963, 'plus', 'D1:выход_контакт2_НО+', 'contact');      // d1.contact2.outX: 424, outY: 1963
addConnectionPoint(280, 530,  'plus', 'D1:выход_контакт3_НЗ+', 'contact');      // d1.contact3.outX: 280, outY: 530


// --- RER ---
addConnectionPoint(2509, 2024, 'plus', 'RER:выход_контакт_НО', 'contact');      // rer.contact.outX: 2509, outY: 2024

// --- RNP ---
addConnectionPoint(1484, 492, 'plus', 'RNP:выход_контакт_НЗ', 'contact');       // rnp.contact.outX: 1484, outY: 492

// --- KM1 ---
addConnectionPoint(1672, 471, 'plus', 'KM1:выход_контакт1_НО-', 'contact');     // km1.contact1.outX: 1672, outY: 471
addConnectionPoint(1912, 885, 'plus', 'KM1:выход_контакт2_НО+', 'contact');     // km1.contact2.outX: 1912, outY: 885
addConnectionPoint(1923, 935, 'plus', 'KM1:выход_контакт3_НО+', 'contact');     // km1.contact3.outX: 1923, outY: 935

// --- RKM1 ---
addConnectionPoint(1776, 552, 'plus', 'RKM1:выход_контакт1_НО-', 'contact');    // rkm1.contact1.outX: 1776, outY: 552
addConnectionPoint(1572, 394, 'plus', 'RKM1:выход_контакт2_НО-', 'contact');    // rkm1.contact2.outX: 1572, outY: 394

// --- VV ---
addConnectionPoint(1567, 361, 'plus', 'VV:выход_контакт_НО+', 'contact');       // vv.contact.outX: 1567, outY: 361

// === ВЫХОДЫ КОНТАКТОВ (plus) — ИЗ relayT.js, ПО ДАННЫМ contact.outX / outY ===

// --- KV ---
addConnectionPoint(2217, 430,  'plus', 'KV:выход_контактNO_НО', 'contact');       // contactNO.outX: 2217, outY: 430
addConnectionPoint(434,  448,  'plus', 'KV:выход_контактNO2_НО', 'contact');      // contactNO2.outX: 434, outY: 448
addConnectionPoint(483,  1940, 'plus', 'KV:выход_контактNC_НЗ', 'contact');       // contactNC.outX: 483, outY: 1940

// --- KU10 ---
addConnectionPoint(648, 280, 'plus', 'KU10:выход_контактNO_НО', 'contact');       // contactNO.outX: 648, outY: 280
addConnectionPoint(483, 254, 'plus', 'KU10:выход_контактNC_НЗ', 'contact');       // contactNC.outX: 483, outY: 254

// --- RV4 ---
addConnectionPoint(593, 378, 'plus', 'RV4:выход_контакт_НЗ', 'contact');          // contact.outX: 593, outY: 378

// --- RU24 ---
addConnectionPoint(645, 378, 'plus', 'RU24:выход_контактNC_НЗ', 'contact');       // contactNC.outX: 645, outY: 378
addConnectionPoint(325, 530, 'plus', 'RU24:выход_контактNC+_НЗ+', 'contact');     // contactNC_Plus.outX: 325, outY: 530

// --- REV FORWARD ---
addConnectionPoint(545,  254,  'plus', 'REV_FORWARD:выход_контакт1_НО', 'contact');  // contact1.outX: 545, outY: 254
addConnectionPoint(412,  2228, 'plus', 'REV_FORWARD:выход_контакт2_НО', 'contact');  // contact2.outX: 412, outY: 2228


// --- REV BACKWARD ---
addConnectionPoint(586,  254,  'plus', 'REV_BACKWARD:выход_контакт1_НО', 'contact'); // contact1.outX: 586, outY: 254
addConnectionPoint(473,  2229, 'plus', 'REV_BACKWARD:выход_контакт2_НО', 'contact'); // contact2.outX: 473, outY: 2229


// --- RKV ---
addConnectionPoint(825,  227, 'plus', 'RKV:выход_контактNO-_НО-', 'contact');     // contactNO_Minus.outX: 825, outY: 227
addConnectionPoint(1786, 592, 'plus', 'RKV:выход_контактNO+_НО+', 'contact');     // contactNO_Plus.outX: 1786, outY: 592

// --- PE1 ---
addConnectionPoint(830,  325, 'plus', 'PE1:выход_контактNC-_НЗ-', 'contact');     // contactNC_Minus.outX: 830, outY: 325
addConnectionPoint(173,  530, 'plus', 'PE1:выход_контактNO+_гориз_НО+', 'contact'); // contactNO_Plus_Horizontal.outX: 173, outY: 530


// --- PE2 ---
addConnectionPoint(831,  277, 'plus', 'PE2:выход_контактNC-_НЗ-', 'contact');     // contactNC_Minus.outX: 831, outY: 277
addConnectionPoint(245,  530, 'plus', 'PE2:выход_контактNO+_гориз_НО+', 'contact'); // contactNO_Plus_Horizontal.outX: 245, outY: 530


// --- RET ---
addConnectionPoint(302, 420, 'plus', 'RET:выход_контактNC_НЗ', 'contact');        // contactNC.outX: 302, outY: 420

// --- RU15 ---
addConnectionPoint(338, 420, 'plus', 'RU15:выход_контактNC_НЗ', 'contact');       // contactNC.outX: 338, outY: 420

// --- BK1 ---
addConnectionPoint(201, 470, 'plus', 'BK1:выход_контакт', 'contact');             // outX: 201, outY: 470

// --- BK2 ---
addConnectionPoint(250, 470, 'plus', 'BK2:выход_контакт', 'contact');             // outX: 250, outY: 470

// --- BK3 ---
addConnectionPoint(307, 470, 'plus', 'BK3:выход_контакт', 'contact');             // outX: 307, outY: 470

// --- RU2 ---
addConnectionPoint(806,  2410, 'plus', 'RU2:выход_контактNC-_НЗ-', 'contact');     // contactNC_Minus.outX: 806, outY: 2410
addConnectionPoint(435,  470,  'plus', 'RU2:выход_контактNC+_НЗ+', 'contact');     // contactNC_Plus.outX: 435, outY: 470
addConnectionPoint(1530, 632,  'plus', 'RU2:выход_контактNO+_НО+', 'contact');     // contactNO_Plus.outX: 1530, outY: 632
addConnectionPoint(2511, 1999, 'plus', 'RU2:выход_контактNO_новый_НО', 'contact'); // contactNO_New.outX: 2511, outY: 1999

// --- KVT1 ---
addConnectionPoint(524, 470, 'plus', 'KVT1:выход_контактNC_НЗ', 'contact');       // contactNC.outX: 524, outY: 470

// --- RT ---
addConnectionPoint(410, 498, 'plus', 'RT:выход_контактNC_НЗ', 'contact');         // contactNC.outX: 410, outY: 498

// --- RU14 ---
addConnectionPoint(366, 530, 'plus', 'RU14:выход_контактNC_НЗ', 'contact');       // contactNC.outX: 366, outY: 530

// --- RT6 ---
addConnectionPoint(466, 530, 'plus', 'RT6:выход_контактNC_НЗ', 'contact');        // contactNC.outX: 466, outY: 530

// --- RT3 ---
addConnectionPoint(553, 530, 'plus', 'RT3:выход_контактNC_НЗ', 'contact');        // contactNC.outX: 553, outY: 530

// --- DRT4 ---
addConnectionPoint(656, 530, 'plus', 'DRT4:выход_контактNO_НО', 'contact');       // contactNO.outX: 656, outY: 530

// --- RZ ---
addConnectionPoint(820, 531, 'plus', 'RZ:выход_контактNC-_НЗ-', 'contact');       // contactNC_Minus.outX: 820, outY: 531

// --- KV ---
addConnectionPoint(2173, 430,  'plus', 'KV:вход_контактNO_НО', 'contact');       // contactNO.inX: 2173, inY: 430
addConnectionPoint(403,  448,  'plus', 'KV:вход_контактNO2_НО', 'contact');      // contactNO2.inX: 403, inY: 448
addConnectionPoint(283,  1940, 'plus', 'KV:вход_контактNC_НЗ', 'contact');       // contactNC.inX: 283, inY: 1940

// --- KU10 ---
addConnectionPoint(674, 280, 'plus', 'KU10:вход_контактNO_НО', 'contact');       // contactNO.inX: 674, inY: 280
addConnectionPoint(455, 254, 'plus', 'KU10:вход_контактNC_НЗ', 'contact');       // contactNC.inX: 455, inY: 254

// --- RV4 ---
addConnectionPoint(567, 379, 'plus', 'RV4:вход_контакт_НЗ', 'contact');          // contact.inX: 567, inY: 379

// --- RU24 ---
addConnectionPoint(625, 378, 'plus', 'RU24:вход_контактNC_НЗ', 'contact');       // contactNC.inX: 625, inY: 378
addConnectionPoint(300, 530, 'plus', 'RU24:вход_контактNC+_НЗ+', 'contact');     // contactNC_Plus.inX: 300, inY: 530

// --- REV FORWARD ---
addConnectionPoint(512,  254,  'plus', 'REV_FORWARD:вход_контакт1_НО', 'contact');  // contact1.inX: 512, inY: 254
addConnectionPoint(384,  2228, 'plus', 'REV_FORWARD:вход_контакт2_НО', 'contact');  // contact2.inX: 384, inY: 2228


// --- REV BACKWARD ---
addConnectionPoint(614,  253,  'plus', 'REV_BACKWARD:вход_контакт1_НО', 'contact'); // contact1.inX: 614, inY: 253
addConnectionPoint(441,  2229, 'plus', 'REV_BACKWARD:вход_контакт2_НО', 'contact'); // contact2.inX: 441, inY: 2229


// --- RKV ---
addConnectionPoint(800,  227, 'plus', 'RKV:вход_контактNO-_НО-', 'contact');     // contactNO_Minus.inX: 800, inY: 227
addConnectionPoint(1753, 592, 'plus', 'RKV:вход_контактNO+_НО+', 'contact');     // contactNO_Plus.inX: 1753, inY: 592

// --- PE1 ---
addConnectionPoint(830,  355, 'plus', 'PE1:вход_контактNC-_НЗ-', 'contact');     // contactNC_Minus.inX: 830, inY: 355
addConnectionPoint(143,  530, 'plus', 'PE1:вход_контактNO+_гориз_НО+', 'contact'); // contactNO_Plus_Horizontal.inX: 143, inY: 530


// --- PE2 ---
addConnectionPoint(831,  304, 'plus', 'PE2:вход_контактNC-_НЗ-', 'contact');     // contactNC_Minus.inX: 831, inY: 304
addConnectionPoint(211,  530, 'plus', 'PE2:вход_контактNO+_гориз_НО+', 'contact'); // contactNO_Plus_Horizontal.inX: 211, inY: 530


// --- RET ---
addConnectionPoint(279, 420, 'plus', 'RET:вход_контактNC_НЗ', 'contact');        // contactNC.inX: 279, inY: 420

// --- RU15 ---
addConnectionPoint(314, 420, 'plus', 'RU15:вход_контактNC_НЗ', 'contact');       // contactNC.inX: 314, inY: 420

// --- BK1 ---
addConnectionPoint(176, 470, 'plus', 'BK1:вход_контакт', 'contact');             // inX: 176, inY: 470

// --- BK2 ---
addConnectionPoint(227, 470, 'plus', 'BK2:вход_контакт', 'contact');             // inX: 227, inY: 470

// --- BK3 ---
addConnectionPoint(277, 470, 'plus', 'BK3:вход_контакт', 'contact');             // inX: 277, inY: 470

// --- RU2 ---
addConnectionPoint(770,  2410, 'plus', 'RU2:вход_контактNC-_НЗ-', 'contact');     // contactNC_Minus.inX: 770, inY: 2410
addConnectionPoint(409,  470,  'plus', 'RU2:вход_контактNC+_НЗ+', 'contact');     // contactNC_Plus.inX: 409, inY: 470
addConnectionPoint(1503, 632,  'plus', 'RU2:вход_контактNO+_НО+', 'contact');     // contactNO_Plus.inX: 1503, inY: 632
addConnectionPoint(2484, 1999, 'plus', 'RU2:вход_контактNO_новый_НО', 'contact'); // contactNO_New.inX: 2484, inY: 1999

// --- KVT1 ---
addConnectionPoint(500, 470, 'plus', 'KVT1:вход_контактNC_НЗ', 'contact');       // contactNC.inX: 500, inY: 470

// --- RT ---
addConnectionPoint(435, 498, 'plus', 'RT:вход_контактNC_НЗ', 'contact');         // contactNC.inX: 435, inY: 498

// --- RU14 ---
addConnectionPoint(343, 530, 'plus', 'RU14:вход_контактNC_НЗ', 'contact');       // contactNC.inX: 343, inY: 530

// --- RT6 ---
addConnectionPoint(438, 530, 'plus', 'RT6:вход_контактNC_НЗ', 'contact');        // contactNC.inX: 438, inY: 530

// --- RT3 ---
addConnectionPoint(525, 530, 'plus', 'RT3:вход_контактNC_НЗ', 'contact');        // contactNC.inX: 525, inY: 530

// --- DRT4 ---
addConnectionPoint(626, 530, 'plus', 'DRT4:вход_контактNO_НО', 'contact');       // contactNO.inX: 626, inY: 530

// --- RZ ---
addConnectionPoint(797, 530, 'plus', 'RZ:вход_контактNC-_НЗ-', 'contact');       // contactNC_Minus.inX: 797, inY: 530

// Точки подключения клеммных реек

addConnectionPoint(233, 1527, 'plus', '14-4', 'contact',);
addConnectionPoint(373, 165, 'plus', '1-8', 'contact',);
addConnectionPoint(314, 699, 'plus', '1-2', 'contact',);
addConnectionPoint(380, 900, 'plus', '15-1', 'contact',);
addConnectionPoint(251, 420, 'plus', '14-3', 'contact',);
addConnectionPoint(1774, 1025, 'minus', '1-1', 'contact',);