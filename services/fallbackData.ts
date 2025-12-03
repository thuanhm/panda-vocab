import { VocabItem } from "../types";

// Simple type for storage (no ID needed yet)
type SimpleVocab = Omit<VocabItem, "id">;

const HSK_DATA: Record<number, SimpleVocab[]> = {
  1: [
    { hanzi: "爱", pinyin: "ài", meaning: "Yêu" },
    { hanzi: "八", pinyin: "bā", meaning: "Số 8" },
    { hanzi: "爸爸", pinyin: "bàba", meaning: "Bố" },
    { hanzi: "杯子", pinyin: "bēizi", meaning: "Cái cốc" },
    { hanzi: "北京", pinyin: "Běijīng", meaning: "Bắc Kinh" },
    { hanzi: "本", pinyin: "běn", meaning: "Quyển (lượng từ)" },
    { hanzi: "不客气", pinyin: "bú kèqi", meaning: "Đừng khách sáo" },
    { hanzi: "菜", pinyin: "cài", meaning: "Món ăn / Rau" },
    { hanzi: "茶", pinyin: "chá", meaning: "Trà" },
    { hanzi: "吃", pinyin: "chī", meaning: "Ăn" },
    { hanzi: "出租车", pinyin: "chūzūchē", meaning: "Taxi" },
    { hanzi: "大", pinyin: "dà", meaning: "To, lớn" },
    { hanzi: "电脑", pinyin: "diànnǎo", meaning: "Máy tính" },
    { hanzi: "电视", pinyin: "diànshì", meaning: "Tivi" },
    { hanzi: "高兴", pinyin: "gāoxìng", meaning: "Vui vẻ" },
  ],
  2: [
    { hanzi: "吧", pinyin: "ba", meaning: "Nhé, đi (trợ từ)" },
    { hanzi: "白", pinyin: "bái", meaning: "Màu trắng" },
    { hanzi: "百", pinyin: "bǎi", meaning: "Trăm" },
    { hanzi: "帮助", pinyin: "bāngzhù", meaning: "Giúp đỡ" },
    { hanzi: "报纸", pinyin: "bàozhǐ", meaning: "Báo giấy" },
    { hanzi: "比", pinyin: "bǐ", meaning: "So với" },
    { hanzi: "别", pinyin: "bié", meaning: "Đừng" },
    { hanzi: "长", pinyin: "cháng", meaning: "Dài" },
    { hanzi: "唱歌", pinyin: "chànggē", meaning: "Hát" },
    { hanzi: "穿", pinyin: "chuān", meaning: "Mặc" },
    { hanzi: "大家", pinyin: "dàjiā", meaning: "Mọi người" },
    { hanzi: "但是", pinyin: "dànshì", meaning: "Nhưng mà" },
    { hanzi: "懂", pinyin: "dǒng", meaning: "Hiểu" },
    { hanzi: "非常", pinyin: "fēicháng", meaning: "Vô cùng" },
    { hanzi: "红", pinyin: "hóng", meaning: "Màu đỏ" },
  ],
  3: [
    { hanzi: "阿姨", pinyin: "āyí", meaning: "Dì, cô" },
    { hanzi: "矮", pinyin: "ǎi", meaning: "Thấp" },
    { hanzi: "爱好", pinyin: "àihào", meaning: "Sở thích" },
    { hanzi: "安静", pinyin: "ānjìng", meaning: "Yên tĩnh" },
    { hanzi: "搬", pinyin: "bān", meaning: "Chuyển, dời" },
    { hanzi: "办法", pinyin: "bànfǎ", meaning: "Biện pháp" },
    { hanzi: "饱", pinyin: "bǎo", meaning: "No" },
    { hanzi: "北方", pinyin: "běifāng", meaning: "Miền Bắc" },
    { hanzi: "必须", pinyin: "bìxū", meaning: "Phải, bắt buộc" },
    { hanzi: "冰箱", pinyin: "bīngxiāng", meaning: "Tủ lạnh" },
    { hanzi: "才", pinyin: "cái", meaning: "Mới (vừa mới)" },
    { hanzi: "草", pinyin: "cǎo", meaning: "Cỏ" },
    { hanzi: "层", pinyin: "céng", meaning: "Tầng" },
    { hanzi: "差", pinyin: "chà", meaning: "Kém, thiếu" },
    { hanzi: "超市", pinyin: "chāoshì", meaning: "Siêu thị" },
  ],
  4: [
    { hanzi: "爱情", pinyin: "àiqíng", meaning: "Tình yêu" },
    { hanzi: "安排", pinyin: "ānpái", meaning: "Sắp xếp" },
    { hanzi: "安全", pinyin: "ānquán", meaning: "An toàn" },
    { hanzi: "暗", pinyin: "àn", meaning: "Tối, ngầm" },
    { hanzi: "按时", pinyin: "ànshí", meaning: "Đúng giờ" },
    { hanzi: "按照", pinyin: "ànzhào", meaning: "Dựa theo" },
    { hanzi: "包括", pinyin: "bāokuò", meaning: "Bao gồm" },
    { hanzi: "保护", pinyin: "bǎohù", meaning: "Bảo vệ" },
    { hanzi: "抱", pinyin: "bào", meaning: "Ôm" },
    { hanzi: "报名", pinyin: "bàomíng", meaning: "Báo danh" },
    { hanzi: "笨", pinyin: "bèn", meaning: "Ngốc" },
    { hanzi: "本来", pinyin: "běnlái", meaning: "Vốn dĩ" },
    { hanzi: "毕业", pinyin: "bìyè", meaning: "Tốt nghiệp" },
    { hanzi: "标准", pinyin: "biāozhǔn", meaning: "Tiêu chuẩn" },
    { hanzi: "表扬", pinyin: "biǎoyáng", meaning: "Tuyên dương" },
  ],
  5: [
    { hanzi: "爱惜", pinyin: "àixī", meaning: "Trân trọng, yêu quý" },
    { hanzi: "爱心", pinyin: "àixīn", meaning: "Lòng yêu thương" },
    { hanzi: "安慰", pinyin: "ānwèi", meaning: "An ủi" },
    { hanzi: "安装", pinyin: "ānzhuāng", meaning: "Lắp đặt" },
    { hanzi: "岸", pinyin: "àn", meaning: "Bờ (sông, biển)" },
    { hanzi: "把握", pinyin: "bǎwò", meaning: "Nắm bắt" },
    { hanzi: "摆", pinyin: "bǎi", meaning: "Bày biện" },
    { hanzi: "班主任", pinyin: "bānzhǔrèn", meaning: "Giáo viên chủ nhiệm" },
    { hanzi: "办理", pinyin: "bànlǐ", meaning: "Xử lý" },
    { hanzi: "棒", pinyin: "bàng", meaning: "Giỏi, tuyệt" },
    { hanzi: "包裹", pinyin: "bāoguǒ", meaning: "Bưu kiện" },
    { hanzi: "包含", pinyin: "bāohán", meaning: "Chứa đựng" },
    { hanzi: "宝贝", pinyin: "bǎobèi", meaning: "Bảo bối" },
    { hanzi: "宝贵", pinyin: "bǎoguì", meaning: "Quý giá" },
    { hanzi: "保持", pinyin: "bǎochí", meaning: "Duy trì" },
  ],
  6: [
    { hanzi: "挨", pinyin: "ái", meaning: "Chịu đựng / Kề bên" },
    { hanzi: "癌症", pinyin: "áizhèng", meaning: "Ung thư" },
    { hanzi: "爱不释手", pinyin: "àibúshìshǒu", meaning: "Yêu không buông tay" },
    { hanzi: "爱戴", pinyin: "àidài", meaning: "Kính yêu" },
    { hanzi: "暧昧", pinyin: "àimèi", meaning: "Mập mờ" },
    { hanzi: "安宁", pinyin: "ānníng", meaning: "An ninh" },
    { hanzi: "安详", pinyin: "ānxiáng", meaning: "An tường, điềm tĩnh" },
    { hanzi: "安置", pinyin: "ānzhì", meaning: "Bố trí" },
    { hanzi: "暗示", pinyin: "ànshì", meaning: "Ám thị" },
    { hanzi: "案件", pinyin: "ànjiàn", meaning: "Vụ án" },
    { hanzi: "昂贵", pinyin: "ángguì", meaning: "Đắt đỏ" },
    { hanzi: "凹凸", pinyin: "āotū", meaning: "Lồi lõm" },
    { hanzi: "巴结", pinyin: "bājie", meaning: "Nịnh bợ" },
    { hanzi: "拔苗助长", pinyin: "bámiáozhùzhǎng", meaning: "Dục tốc bất đạt" },
    { hanzi: "把关", pinyin: "bǎguān", meaning: "Kiểm tra, rà soát" },
  ],
  // Fallback for higher levels (using a mix of idioms or high level words)
  7: [
    { hanzi: "博大精深", pinyin: "bódàjīngshēn", meaning: "Uyên bác thâm sâu" },
    { hanzi: "不可思议", pinyin: "bùkěsīyì", meaning: "Không thể tưởng tượng nổi" },
    { hanzi: "不屑一顾", pinyin: "búxièyígù", meaning: "Không thèm để ý" },
    { hanzi: "沧海桑田", pinyin: "cānghǎisāngtián", meaning: "Bãi bể nương dâu" },
    { hanzi: "草木皆兵", pinyin: "cǎomùjiēbīng", meaning: "Thần hồn nát thần tính" },
    { hanzi: "持之以恒", pinyin: "chízhīyǐhéng", meaning: "Kiên trì bền bỉ" },
    { hanzi: "出类拔萃", pinyin: "chūlèibácuì", meaning: "Xuất chúng" },
    { hanzi: "吹毛求疵", pinyin: "chuīmáoqiúcī", meaning: "Bới lông tìm vết" },
  ],
  8: [
     { hanzi: "唇亡齿寒", pinyin: "chúnwángchǐhán", meaning: "Môi hở răng lạnh" },
     { hanzi: "打草惊蛇", pinyin: "dǎcǎojīngshé", meaning: "Đánh rắn động cỏ" },
     { hanzi: "大刀阔斧", pinyin: "dàdāokuòfǔ", meaning: "Mạnh tay quyết liệt" },
     { hanzi: "当仁不让", pinyin: "dāngrénbúràng", meaning: "Đương nhiên không nhường" },
     { hanzi: "德高望重", pinyin: "dégāowàngzhòng", meaning: "Đức cao vọng trọng" },
     { hanzi: "东施效颦", pinyin: "dōngshīxiàopín", meaning: "Đông Thi hiệu tần (Bắt chước bừa)" },
     { hanzi: "对症下药", pinyin: "duìzhèngxiàyào", meaning: "Bốc thuốc đúng bệnh" },
  ],
  9: [
     { hanzi: "得寸进尺", pinyin: "décùnjìnchǐ", meaning: "Được đằng chân lân đằng đầu" },
     { hanzi: "对牛弹琴", pinyin: "duìniútánqín", meaning: "Đàn gảy tai trâu" },
     { hanzi: "恩重如山", pinyin: "ēnzhòngrúshān", meaning: "Ơn nặng tựa núi" },
     { hanzi: "防患未然", pinyin: "fánghuànwèirán", meaning: "Phòng bệnh hơn chữa bệnh" },
     { hanzi: "废寝忘食", pinyin: "fèiqǐnwàngshí", meaning: "Mất ăn mất ngủ (chăm chỉ)" },
     { hanzi: "奉公守法", pinyin: "fènggōngshǒufǎ", meaning: "Phụng công thủ pháp" },
     { hanzi: "釜底抽薪", pinyin: "fǔdǐchōuxīn", meaning: "Rút củi đáy nồi" },
  ]
};

/**
 * Get random vocabulary from offline storage
 */
export const getRandomFallbackVocab = (level: number, count: number): VocabItem[] => {
  // Get list by level, fallback to level 6 if level not found (e.g. specialized HSK levels)
  // If even 6 is missing (should not happen), fallback to 1.
  let sourceList = HSK_DATA[level];
  if (!sourceList || sourceList.length === 0) {
    sourceList = HSK_DATA[6] || HSK_DATA[1];
  }

  // Clone to avoid mutating source
  const clone = [...sourceList];

  // Fisher-Yates Shuffle
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }

  // Slice required count
  const selected = clone.slice(0, count);

  // Add runtime ID
  return selected.map((item, index) => ({
    ...item,
    id: `fallback-${level}-${Date.now()}-${index}`
  }));
};