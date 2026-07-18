"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import MoreMenu from "../components/MoreMenu";

const TESTIMONI_DATA = [
  { name:"Budi Santoso", pkg:"Gold", rating:5, verified:true, date:"2 hari lalu", text:"Sinyal dari RC beneran akurat banget! Dalam 2 bulan portofolio naik 34%. Portfolio gua dari 15jt jadi 22jt. Rekomen banget!" },
  { name:"Siti Rahmawati", pkg:"Pro", rating:5, verified:true, date:"3 hari lalu", text:"AI Agent-nya keren banget, bisa analisis chart langsung. Modul edukasinya juga detail dari dasar sampai advanced. Worth it!" },
  { name:"Andi Wijaya", pkg:"Silver", rating:4, verified:false, date:"5 hari lalu", text:"Komunitas aktif, admin responsif. Sinyal silver udah worth it buat pemula kayak gua. Lanjut upgrade Gold!" },
  { name:"Dewi Kusuma", pkg:"Platinum", rating:5, verified:true, date:"1 minggu lalu", text:"Konsultasi 1-on-1 dengan analis senior ngebantu banget. Return gua konsisten setiap bulan. Best investment platform!" },
  { name:"Rizki Pratama", pkg:"Elite", rating:5, verified:true, date:"1 minggu lalu", text:"Dari modal 10jt sekarang udah 47jt dalam 8 bulan. RC adalah keputusan terbaik gua di dunia investasi!" },
  { name:"Fauzan Hidayat", pkg:"Gold", rating:5, verified:true, date:"10 hari lalu", text:"Sinyal TP1 selalu kena, sering nyentuh TP2 dan TP3 juga. Analisis bandarnya tajam banget!" },
  { name:"Maya Sari", pkg:"Pro", rating:5, verified:false, date:"2 minggu lalu", text:"Groupnya aktif 24 jam, selalu ada yang jawab pertanyaan. Admin ramah dan profesional." },
  { name:"Dika Firmansyah", pkg:"Basic", rating:4, verified:false, date:"2 minggu lalu", text:"Cocok untuk pemula. Modul dasarnya mudah dipahami, sinyal juga selalu disertai analisis." },
  { name:"Rini Hastuti", pkg:"Silver", rating:5, verified:true, date:"3 minggu lalu", text:"Screening saham baggernya jitu banget! Udah dapat 3 bagger dalam 6 bulan ikut RC." },
  { name:"Tommy Susanto", pkg:"Gold", rating:5, verified:true, date:"3 minggu lalu", text:"Sebelum ikut RC sering panic selling. Sekarang lebih tenang dan disiplin thanks to psikologi trading module." },
  { name:"Linda Cahyani", pkg:"Platinum", rating:5, verified:true, date:"1 bulan lalu", text:"Live session 1-on-1 dengan analis senior worth banget! Portfolio gua naik konsisten." },
  { name:"Hendra Gunawan", pkg:"Pro", rating:5, verified:false, date:"1 bulan lalu", text:"Bandarmologi module bikin gua bisa deteksi akumulasi bandar sebelum saham naik besar. Epic!" },
  { name:"Nisa Permata", pkg:"Gold", rating:4, verified:true, date:"1 bulan lalu", text:"Sinyal masih sangat baik. Admin cepat response kalau ada pertanyaan. Highly recommended!" },
  { name:"Arif Rahman", pkg:"Elite", rating:5, verified:true, date:"6 minggu lalu", text:"Mentoring langsung dengan mentor senior. Portofolio gua dimanage dengan baik. ROI 89% dalam setahun!" },
  { name:"Putri Wulandari", pkg:"Silver", rating:5, verified:false, date:"6 minggu lalu", text:"Baru 3 bulan join udah balik modal 2x lipat. Sinyal silvernya konsisten dan akurat." },
  { name:"Bagus Setiawan", pkg:"Gold", rating:5, verified:true, date:"2 bulan lalu", text:"Bagger picks-nya luarbiasa. Dapat saham naik 300% dalam 4 bulan. RC changed my life!" },
  { name:"Sri Mulyani", pkg:"Pro", rating:4, verified:true, date:"2 bulan lalu", text:"AI agent-nya cepat dan akurat analisisnya. Bisa tanya kapanpun dan selalu ada jawaban lengkap." },
  { name:"Agus Pranoto", pkg:"Basic", rating:5, verified:false, date:"2 bulan lalu", text:"Cocok banget buat pemula. Penjelasannya simple tapi mudah dipahami. Mau upgrade Gold!" },
  { name:"Yuni Astuti", pkg:"Platinum", rating:5, verified:true, date:"2 bulan lalu", text:"Sinyal real-time 24/7 dan akses semua modul. Worth every rupiah yang gua bayar!" },
  { name:"Wahyu Nugroho", pkg:"Gold", rating:5, verified:true, date:"3 bulan lalu", text:"Tape reading intraday-nya akurat. Bisa profit harian sekarang berkat panduan dari RC." },
  { name:"Fitriani Dewi", pkg:"Silver", rating:4, verified:false, date:"3 bulan lalu", text:"Sebelumnya gak tau apa-apa soal saham. Sekarang udah bisa baca chart dan analisis sendiri!" },
  { name:"Rendra Saputra", pkg:"Elite", rating:5, verified:true, date:"3 bulan lalu", text:"Return 120% dalam 10 bulan dengan bimbingan dari RC. Best decision I've ever made!" },
  { name:"Amalia Rahman", pkg:"Gold", rating:5, verified:true, date:"4 bulan lalu", text:"Signal BUY BBCA kemarin TP1 kena dalam 3 hari! Akurasi RC emang top level." },
  { name:"Yoga Pratama", pkg:"Pro", rating:4, verified:false, date:"4 bulan lalu", text:"Modul fundamental sangat detail dan aplikatif. Sekarang bisa valuasi saham sendiri dengan DCF." },
  { name:"Nurul Hasanah", pkg:"Basic", rating:5, verified:true, date:"4 bulan lalu", text:"Komunitas RC solid banget. Member saling support dan share analisis. Bikin makin semangat investasi!" },
  { name:"Dodi Permana", pkg:"Platinum", rating:5, verified:true, date:"5 bulan lalu", text:"Bagger picks RC konsisten. Dapat 5 bagger dalam setahun ikut RC. Return total 340%!" },
  { name:"Kartika Sari", pkg:"Silver", rating:4, verified:false, date:"5 bulan lalu", text:"Manajemen risiko yang diajarkan RC bikin gua lebih tenang. Tidak panik lagi saat market turun." },
  { name:"Bayu Kurniawan", pkg:"Gold", rating:5, verified:true, date:"5 bulan lalu", text:"Admin selalu update sinyal and analisis. Grup aktif diskusi setiap hari. Mantap!" },
  { name:"Tri Wahyuni", pkg:"Pro", rating:5, verified:true, date:"6 bulan lalu", text:"AI Agent RC 24/7 ready. Kalau ada pertanyaan teknikal dijawab detail dengan chart analysis langsung!" },
  { name:"Maulana Ibrahim", pkg:"Elite", rating:5, verified:true, date:"6 bulan lalu", text:"Dari newbie total sekarang udah bisa trading mandiri. Terima kasih RC atas ilmu dan bimbingannya!" },
  { name:"Anggraini Putri", pkg:"Gold", rating:5, verified:false, date:"7 bulan lalu", text:"Sinyal bandar RC tepat banget. Beli di harga akumulasi, jual saat distribusi. Profit konsisten!" },
  { name:"Farhan Aziz", pkg:"Silver", rating:4, verified:true, date:"7 bulan lalu", text:"Worth banget! Modal 5jt dalam 4 bulan jadi 9jt. RC beneran ngebantu trader pemula." },
  { name:"Widi Santoso", pkg:"Platinum", rating:5, verified:true, date:"8 bulan lalu", text:"Level konsultasi dan layanan RC unmatched. Analis seniornya expert dan sabar menjelaskan." },
  { name:"Indah Lestari", pkg:"Basic", rating:5, verified:false, date:"8 bulan lalu", text:"Modul pemula RC sangat komprehensif. Belajar dari nol sampai bisa analisis sendiri dalam 2 bulan!" },
  { name:"Prasetyo Adi", pkg:"Gold", rating:5, verified:true, date:"9 bulan lalu", text:"Sinyal TP3 kena berkali-kali. RC emang level tersendiri untuk komunitas saham Indonesia." },
  { name:"Shinta Melati", pkg:"Pro", rating:4, verified:true, date:"9 bulan lalu", text:"Watchlist RC selalu update. Saham-saham yang masuk watchlist selalu ada yang naik signifikan." },
  { name:"Reza Firmansyah", pkg:"Elite", rating:5, verified:true, date:"10 bulan lalu", text:"Portofolio management personal dari RC top banget. ROI 156% dalam setahun. Luar biasa!" },
  { name:"Oktavia Sari", pkg:"Silver", rating:5, verified:false, date:"10 bulan lalu", text:"Analisis fundamental yang diajarkan RC buka pikiran gua soal value investing. Thanks RC!" },
  { name:"Bambang Susilo", pkg:"Gold", rating:5, verified:true, date:"11 bulan lalu", text:"Ikut RC dari awal. Kualitas sinyal dan edukasi selalu konsisten tinggi. Highly recommended!" },
  { name:"Fitria Handayani", pkg:"Platinum", rating:5, verified:true, date:"1 tahun lalu", text:"1 tahun bersama RC, portofolio naik 267%. Investasi terbaik adalah investasi ke RC!" },
];

const PKG_FILTER = ["Semua","Basic","Silver","Gold","Pro","Platinum","Elite"];

export default function TestimoniPage() {
  const [filter, setFilter] = useState("Semua");
  const [dynamicTestis, setDynamicTestis] = useState<any[]>([]);

  useEffect(()=>{
    fetch("/api/admin/sync").then(r=>r.json()).then(d=>{
      if (d.testimonials_data?.length) setDynamicTestis(d.testimonials_data);
    }).catch(()=>{});
  },[]);

  const allTestis = dynamicTestis.length > 0 ? dynamicTestis : TESTIMONI_DATA;
  const displayed = filter === "Semua" ? allTestis : allTestis.filter((t:any)=>t.pkg===filter);
  const avgRating = (allTestis.reduce((a:number,t:any)=>a+(t.rating||5),0)/allTestis.length).toFixed(1);

  return (
    <div className="min-h-screen bg-[#030712] text-[#EDEEF0] max-w-[480px] mx-auto font-sans relative">
      <div className="galaxy-stars" />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#030712]/95 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="headline text-lg font-black">
            TESTIMONI <span className="accent">MEMBER</span>
          </h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            {allTestis.length}+ ulasan · Rating {avgRating}/5.0
          </p>
        </div>
        <div className="text-right flex items-center gap-2">
          <div className="text-2xl font-black text-emerald-500 leading-none">{avgRating}</div>
          <div className="flex flex-col gap-0.5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-4 pb-20">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { v: allTestis.length + "+", l: "Total Ulasan" },
            { v: avgRating + "/5", l: "Avg Rating" },
            { v: "98%", l: "Rekomendasi" }
          ].map(s => (
            <div key={s.l} className="glass-card no-mark p-3 text-center">
              <div className="text-lg font-black text-emerald-500">{s.v}</div>
              <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Filter / MoreMenu replacement */}
        <div className="flex items-center justify-between mb-4 glass-card no-mark px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Kategori:</span>
            <span className="tag-chip solid text-[10px] py-1">{filter}</span>
          </div>
          <MoreMenu
            items={PKG_FILTER.map(f => ({
              id: f,
              label: f,
              onSelect: () => setFilter(f),
              active: filter === f
            }))}
          />
        </div>

        {/* Testimoni list */}
        <div className="space-y-3">
          {displayed.map((t:any, i:number) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="index-badge">
                  {(t.name || "A")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white truncate">{t.name}</span>
                    {t.verified && (
                      <svg className="w-3.5 h-3.5 text-emerald-500 fill-current flex-shrink-0" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 011.414 1.414z"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="tag-chip py-0.5 px-2 text-[9px]">{t.pkg}</span>
                    <span className="text-neutral-400 text-[10px]">{t.date}</span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className={`w-3 h-3 ${s <= (t.rating || 5) ? "text-emerald-500 fill-emerald-500" : "text-neutral-700 fill-neutral-700"}`} viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-neutral-300 text-xs leading-relaxed italic">"{t.text}"</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass-card mark-lg p-6 text-center my-6">
          <h3 className="headline text-base mb-1">MAU <span className="accent">BERGABUNG?</span></h3>
          <p className="text-neutral-400 text-[11px] mb-4">Bergabung dengan 1.000+ investor aktif RITEL COMMUNITY.ID</p>
          <div className="plus-divider mx-auto my-4" />
          <div className="flex gap-3">
            <Link href="/paket" className="btn-primary flex-1 text-xs py-2.5 font-bold uppercase tracking-wider">
              Lihat Paket
            </Link>
            <a
              href="https://wa.me/6282218723401"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs py-2.5 rounded-lg uppercase tracking-wider transition-all"
            >
              WA Admin
            </a>
          </div>
        </div>

        <div className="text-center text-[10px] text-neutral-600 pt-4">
          Developed by THIRAFI THARIQ AL IDRIS
        </div>
      </div>
    </div>
  );
}
