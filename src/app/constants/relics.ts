export interface Relic {
    id: string;
    englishName: string;
    koreanName: string;
    grade: string;
    job: string;
    imageUrl: string;
    description?: string;
}

export const RELICS_DATA: Relic[] = [
    {
        id: "aged_ginseng",
        englishName: "Aged Ginseng",
        koreanName: "백년 묵은 삼",
        grade: "side",
        job: "기사",
        imageUrl: "/relics/side/aged_ginseng.png",
        description: "섭취 시:\n" +
            "힘 효과가 적용되어 있을 때,\n" +
            "효과 단계를 두 배로 증폭, 최대 100단계\n" +
            "60초 후 재사용 가능"
    },
    {
        id: "aggressive_horn",
        englishName: "Aggressive Horn",
        koreanName: "도발의 뿔나팔",
        grade: "basic",
        job: "기사",
        imageUrl: "/relics/basic/aggressive_horn.png",
        description: "사용 시:\n" +
            "속도 증가 II 3초 획득\n" +
            "8블록 내 적들의 주의를 끌어 15초간 유지\n" +
            "• 이때 적 하나 당 분노 +30\n" +
            "25초 후 재사용 가능"
    },
    {
        id: "ancient_spell_book",
        englishName: "Ancient Spell Book",
        koreanName: "마법 고서",
        grade: "side",
        job: "마법사수",
        imageUrl: "/relics/side/ancient_spell_book.png",
        description: "사용 시:\n" +
            "7초간 자신에게 다음 효과 적용:\n" +
            "• 마력 소모량 -15%\n" +
            "• 이동속도 -50%\n" +
            "60초 후 재사용 가능"
    },
    /*{
        id: "ancient_spell_book_using",
        englishName: "Ancient Spell Book Using",
        koreanName: "ancient_spell_book_using",
        grade: "side",
        job: "none",
        imageUrl: "/relics/side/ancient_spell_book_using.png",
        description: ""
    },*/
    {
        id: "apple_with_arrow",
        englishName: "Apple With Arrow",
        koreanName: "화살 꽂힌 사과",
        grade: "shop",
        job: "사냥꾼",
        imageUrl: "/relics/shop/apple_with_arrow.png",
        description: "소지 시:\n" +
            "적에게 입히는 모든 발사체 피해에 머리 적중 판정 적용"
    },
    {
        id: "assassin_bandana",
        englishName: "Assassin Bandana",
        koreanName: "암살자 복면",
        grade: "side",
        job: "사냥꾼",
        imageUrl: "/relics/side/assassin_bandana.png",
        description: "소지 시:\n" +
            "즉사 공격으로 적을 처치할 때마다,\n" +
            "다음 공격에 30% 확률의 즉사 효과 적용"
    },
    {
        id: "assassin_boots",
        englishName: "Assassin Boots",
        koreanName: "암살자의 부츠",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/assassin_boots.png",
        description: "소지 시:\n" +
            "적 처치 시 신속 II 5초 획득"
    },
    {
        id: "band_aid",
        englishName: "Band Aid",
        koreanName: "반창고",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/band_aid.png",
        description: "소지 시:\n" +
            "체력이 절반 이하일 때,\n" +
            "적에게 피해를 받으면 재생 I 5초 획득"
    },
    {
        id: "bandage",
        englishName: "Bandage",
        koreanName: "붕대",
        grade: "side",
        job: "common",
        imageUrl: "/relics/side/bandage.png",
        description: "소지 시:\n" +
            "스스로에게 입히는 피해 20% 방어"
    },
    {
        id: "bedroll",
        englishName: "Bedroll",
        koreanName: "침낭",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/bedroll.png",
        description: "소지 시:\n" +
            "한 번도 죽지 않고 보스를 처치하면 최대 체력 2씩 증가"
    },
    {
        id: "big_magnet",
        englishName: "Big Magnet",
        koreanName: "거대 자석",
        grade: "shop",
        job: "기사",
        imageUrl: "/relics/shop/big_magnet.png",
        description: "소지 시:\n" +
            "방패를 사용하는 동안 바라보는 적을 향해 이동"
    },
    {
        id: "blaze_heart",
        englishName: "Blaze Heart",
        koreanName: "블레이즈 심장",
        grade: "basic",
        job: "기사",
        imageUrl: "/relics/basic/blaze_heart.png",
        description: "소지 시:\n" +
            "방패로 피해 방어 시 분노 누적\n" +
            "쌓인 분노만큼:\n" +
            "• 근접 공격력 증폭, 최대 100%\n" +
            "• 물리 피해 감소, 최대 50%"
    },
    {
        id: "blazing_mace",
        englishName: "Blazing Mace",
        koreanName: "철퇴",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/blazing_mace.png",
        description: "소지 시:\n" +
            "낙하 피해를 입지 않으며,\n" +
            "낙하 도중 철퇴로 적 공격 시 낙하 피해의 15배 부여\n" +
            "이때 20초 간 방패 사용 불가"
    },
    {
        id: "blood_oath",
        englishName: "Blood Oath",
        koreanName: "혈서",
        grade: "side",
        job: "common",
        imageUrl: "/relics/side/blood_oath.png",
        description: "\n" +
            "소지 시:\n" +
            "체력이 가득 차있을 때,\n" +
            "스스로에게 입히는 피해 50% 방어"
    },
    {
        id: "boiling_blood",
        englishName: "Boiling Blood",
        koreanName: "들끓는 피",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/boiling_blood.png",
        description: "소지 시:\n" +
            "적에게 받은 근접 피해를 누적하여,\n" +
            "다음 공격에 합산된 추가 피해 적용, 최대 200"
    },
    {
        id: "book_of_blizzard",
        englishName: "Book Of Blizzard",
        koreanName: "눈보라의 서",
        grade: "boss",
        job: "마법사수",
        imageUrl: "/relics/boss/book_of_blizzard.png",
        description: "사용 시:\n" +
            "사용하는 동안 눈보라 마법 준비, 0.5초당 마력 8 소모\n" +
            "준비를 마치면 바라보는 곳에 눈덩이 발사\n" +
            "• 눈덩이가 부딪힌 위치에 얼음 가시 소환\n" +
            "• 눈덩이의 개수는 시전 시간에 비례\n" +
            "80초 후 재사용 가능"
    },
    {
        id: "book_of_explosion",
        englishName: "Book Of Explosion",
        koreanName: "폭렬의 서",
        grade: "boss",
        job: "마법사수",
        imageUrl: "/relics/boss/book_of_explosion.png",
        description: "사용 시:\n" +
            "사용하는 동안 폭렬 마법 준비, 0.5초당 마력 8 소모\n" +
            "준비를 마치면 바라보는 곳에 거대한 폭발 생성\n" +
            "• 폭발 규모는 시전 시간에 비례\n" +
            "80초 후 재사용 가능"
    },
    {
        id: "book_of_inferno",
        englishName: "Book Of Inferno",
        koreanName: "작열의 서",
        grade: "boss",
        job: "마법사수",
        imageUrl: "/relics/boss/book_of_inferno.png",
        description: "사용 시:\n" +
            "사용하는 동안 작열 마법 준비, 0.5초당 마력 8 소모\n" +
            "준비를 마치면 바라보는 방향으로 화염 광선 발사\n" +
            "• 화염 광선의 지속시간은 시전 시간에 비례\n" +
            "80초 후 재사용 가능"
    },
    {
        id: "book_of_thunderstorm",
        englishName: "Book Of Thunderstorm",
        koreanName: "뇌우의 서",
        grade: "boss",
        job: "마법사수",
        imageUrl: "/relics/boss/book_of_thunderstorm.png",
        description: "사용 시:\n" +
            "사용하는 동안 뇌우 마법 준비, 0.5초당 마력 8 소모\n" +
            "준비를 마치면 연쇄적으로 무작위 적에게 번개 소환\n" +
            "• 번개 소환 횟수는 시전 시간에 비례\n" +
            "80초 후 재사용 가능"
    },
    {
        id: "boomerang",
        englishName: "Boomerang",
        koreanName: "부메랑",
        grade: "basic",
        job: "사냥꾼",
        imageUrl: "/relics/basic/boomerang.png",
        description: "사용 시:\n" +
            "되돌아오는 부메랑 투척,\n" +
            "적중한 적의 주의를 끌고 잠시 기절시킴\n" +
            "• 해당 적에게 5초 안에 입히는 다음 화살 피해 +200%\n" +
            "• 부메랑이 근처 적 방향으로 튕겨짐\n" +
            "18초 후 재사용 가능"
    },
    {
        id: "bounty_poster",
        englishName: "Bounty Poster",
        koreanName: "현상금 포스터",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/bounty_poster.png",
        description: "소지 시:\n" +
            "보스 클리어 시 루비 64개 획득 및 유물 소멸\n" +
            "사망 시 유물 즉시 소멸"
    },
    {
        id: "breeze_heart",
        englishName: "Breeze Heart",
        koreanName: "브리즈의 심장",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/breeze_heart.png",
        description: "소지 시:\n" +
            "도약의 깃털을 사용할 때마다,\n" +
            "1초간 받는 적의 공격을 반사\n" +
            "• 이때 반사하는 피해 +50\n" +
            "반사 시마다 속도 증가 II 5초 획득"
    },
    {
        id: "broken_hourglass",
        englishName: "Broken Hourglass",
        koreanName: "깨진 모래시계",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/broken_hourglass.png",
        description: "소지 시:\n" +
            "20초 이하의 모든 유물 쿨다운 20% 확률로 무시"
    },
    {
        id: "broken_key",
        englishName: "Broken Key",
        koreanName: "오래된 열쇄",
        grade: "shop",
        job: "none",
        imageUrl: "/relics/shop/broken_key.png",
        description: "소지 시:\n" +
            "일반 유물 상자의 선택지 1개 증가"
    },
    {
        id: "burning_skull",
        englishName: "Burning Skull",
        koreanName: "불타는 해골",
        grade: "side",
        job: "마법사수",
        imageUrl: "/relics/side/burning_skull.png",
        description: "소지 시:\n" +
            "적에게 화염 공격을 입힌 직후 5초간,\n" +
            "해당 적에게 입히는 피해 +50%"
    },
    {
        id: "candlestick",
        englishName: "Candlestick",
        koreanName: "촛대",
        grade: "side",
        job: "마법사수",
        imageUrl: "/relics/side/candlestick.png",
        description: "소지 시:\n" +
            "적에게 입히는 화염 공격의 피해 +50%"
    },
    {
        id: "censer",
        englishName: "Censer",
        koreanName: "향로",
        grade: "side",
        job: "마법사수",
        imageUrl: "/relics/side/censer.png",
        description: "소지 시:\n" +
            "적에게 화염 공격을 입힐 때마다,\n" +
            "해당 피해의 30%만큼 다음 화살 공격의 피해량 증가\n" +
            "• 중첩하여 피해량 누적 가능, 최대 200"
    },
    {
        id: "cloud_bread",
        englishName: "Cloud Bread",
        koreanName: "구름빵",
        grade: "side",
        job: "기사",
        imageUrl: "/relics/side/cloud_bread.png",
        description: "섭취 시:\n" +
            "공중 부양 10단계 2초 획득\n" +
            "10초 후 재사용 가능"
    },
    {
        id: "cracked_orb",
        englishName: "Cracked Orb",
        koreanName: "금 간 수정구",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/cracked_orb.png",
        description: "소지 시:\n" +
            "적에게 받는 마법 피해 40% 감소\n" +
            "적에게 받는 근접 피해 10% 증가"
    },
    /*{
        id: "creeper_stone_slate",
        englishName: "Creeper Stone Slate",
        koreanName: "creeper_stone_slate",
        grade: "shop",
        job: "none",
        imageUrl: "/relics/shop/creeper_stone_slate.png",
        description: ""
    },*/
    {
        id: "cross_necklace",
        englishName: "Cross Necklace",
        koreanName: "십자가 목걸이",
        grade: "side",
        job: "기사,마법사수",
        imageUrl: "/relics/side/cross_necklace.png",
        description: "소지 시:\n" +
            "자신과 동료에게 흡수 효과를 부여할 때,\n" +
            "효과 지속시간을 두 배로 증폭"
    },
    {
        id: "d20",
        englishName: "D20",
        koreanName: "20면체 주사위",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/d20.png",
        description: "사용 시:\n" +
            "최대 체력 2 감소\n" +
            "무작위로 1~20 범위의 눈금 결정,\n" +
            "해당 눈금만큼 적에게 입히는 근접 및 화살 피해 증가"
    },
    {
        id: "dark_cloud_in_a_bottle",
        englishName: "Dark Cloud In A Bottle",
        koreanName: "병 속의 먹구름",
        grade: "side",
        job: "마법사수",
        imageUrl: "/relics/side/dark_cloud_in_a_bottle.png",
        description: "소지 시:\n" +
            "번개 공격 시 무작위 적에게 또 다른 번개 소환"
    },
    {
        id: "dark_cloud_shroom",
        englishName: "Dark Cloud Shroom",
        koreanName: "먹구름 버섯",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/dark_cloud_shroom.png",
        description: "섭취 시:\n" +
            "모든 적에게 20의 피해와 시듦 III 20초 부여\n" +
            "스스로에게 3의 피해를 입힘\n" +
            "7초 후 재사용 가능"
    },
    {
        id: "dark_holy_nail",
        englishName: "Dark Holy Nail",
        koreanName: "검은 성정",
        grade: "side",
        job: "사냥꾼",
        imageUrl: "/relics/side/dark_holy_nail.png",
        description: "소지 시:\n" +
            "시듦 효과를 지닌 적에게 화살 적중 시,\n" +
            "효과 단계 ×40의 추가 피해를 입히며 해당 효과 제거"
    },
    {
        id: "dartboard",
        englishName: "Dartboard",
        koreanName: "과녁판",
        grade: "shop",
        job: "사냥꾼",
        imageUrl: "/relics/shop/dartboard.png",
        description: "소지 시:\n" +
            "투척형 유물이 적의 머리를 적중할 때마다,\n" +
            "해당 적에게 입히는 다음 피해 +150%"
    },
    {
        id: "desert_rose",
        englishName: "Desert Rose",
        koreanName: "사막의 장미",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/desert_rose.png",
        description: "소지 시:\n" +
            "허기가 절반 이하일 때 재생 II 효과 지속"
    },
    {
        id: "detonator",
        englishName: "Detonator",
        koreanName: "기폭장치",
        grade: "side",
        job: "사냥꾼,마법사수",
        imageUrl: "/relics/side/detonator.png",
        description: "사용 시:\n" +
            "폭발 피해를 줬던 적들에게 한 번 더 폭발 발생\n" +
            "5초 후 재사용 가능"
    },
    {
        id: "devil_trident",
        englishName: "Devil Trident",
        koreanName: "악마의 창",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/devil_trident.png",
        description: "사용 시:\n" +
            "적을 관통하는 창 투척\n" +
            "• 적중한 적 즉사, 보스는 대신 30의 피해 부여\n" +
            "• 대상 주위 12블록 내 적에게 시듦 III 20초 부여\n" +
            "30초 후 되돌아오나 직접 회수 가능\n" +
            "10초 후 재사용 가능"
    },
    {
        id: "dynamite",
        englishName: "Dynamite",
        koreanName: "다이너마이트",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/dynamite.png",
        description: "사용 시:\n" +
            "1초 뒤에 터지는 다이너마이트 투척\n" +
            "• 폭발 지점 4블록 내 적을 즉사시킴\n" +
            "• 보스는 예외, 대신 피해량 +200\n" +
            "12초 후 재사용 가능"
    },
    {
        id: "earthquake_hammer",
        englishName: "Earthquake Hammer",
        koreanName: "지진 망치",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/earthquake_hammer.png",
        description: "사용 시:\n" +
            "앞으로 도약, 착지 시 방사형 범위로 적 공격\n" +
            "• 낙하 피해의 4배를 적에게 부여\n" +
            "• 적 공격 시마다 힘 I 10초 획득\n" +
            "• 이미 힘 효과가 있다면 한 단계 증폭\n" +
            "10초 후 재사용 가능"
    },
    {
        id: "eight_ball",
        englishName: "Eight Ball",
        koreanName: "8번 공",
        grade: "side",
        job: "기사",
        imageUrl: "/relics/side/eight_ball.png",
        description: "소지 시:\n" +
            "적을 강하게 밀칠 때 피해 부여\n" +
            "• 밀쳐진 힘에 비례, 최대 20"
    },
    {
        id: "ender_dragon_scales",
        englishName: "Ender Dragon Scales",
        koreanName: "엔더 드래곤 비늘",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/ender_dragon_scales.png",
        description: "소지 시:\n" +
            "무기를 손에 든 상태에서,\n" +
            "달리는 도중 방패를 사용하면 앞으로 돌진\n" +
            "• 돌진 중 부딪치는 적을 강하게 밀침\n" +
            "• 밀쳐낸 적에게 자신의 체력 ×3의 피해 부여\n" +
            "• 적을 밀쳐낼 때마다 속도 증가 II 2초 획득 혹은 연장\n" +
            "12초 후 재사용 가능"
    },
    {
        id: "ender_pearl_bundle",
        englishName: "Ender Pearl Bundle",
        koreanName: "엔더 진주 주머니",
        grade: "basic",
        job: "마법사수",
        imageUrl: "/relics/basic/ender_pearl_bundle.png",
        description: "사용 시:\n" +
            "엔더 진주 투척\n" +
            "7초 후 재사용 가능"
    },
    {
        id: "excalibur",
        englishName: "Excalibur",
        koreanName: "수호의 성검",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/excalibur.png",
        description: "사용 시:\n" +
            "바라보는 곳에 성검 소환:\n" +
            "• 직격한 적에게 50의 피해 부여\n" +
            "• 8블록 내 적을 강하게 밀쳐냄\n" +
            "• 8블록 내 자신 및 동료에게 흡수 II 5초 부여\n" +
            "25초 후 재사용 가능"
    },
    /*{
        id: "explorer_pouch",
        englishName: "Explorer Pouch",
        koreanName: "모험가의 주머니",
        grade: "shop",
        job: "none",
        imageUrl: "/relics/shop/explorer_pouch.png",
        description: ""
    },*/
    {
        id: "false_coin",
        englishName: "False Coin",
        koreanName: "가짜 금화",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/false_coin.png",
        description: "소지 시:\n" +
            "루비 획득량 30% 증가\n" +
            "보스 유물 상자의 유물 선택지 1개 감소"
    },
    {
        id: "feather_of_leaping",
        englishName: "Feather Of Leaping",
        koreanName: "도약의 깃털",
        grade: "basic",
        job: "사냥꾼",
        imageUrl: "/relics/basic/feather_of_leaping.png",
        description: "소지 시:\n" +
            "공중에서 웅크리기로 짧게 도약 가능\n" +
            "3초 후 재사용 가능, 적 처치 시 즉시 초기화"
    },
    {
        id: "fickle_gear",
        englishName: "Fickle Gear",
        koreanName: "변덕스러운 톱니바퀴",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/fickle_gear.png",
        description: "소지 시:\n" +
            "적에게 피해를 입힐 때마다 모든 유물 쿨다운 1초 단축\n" +
            "적에게 피해를 받을 때마다 모든 유물 쿨다운 2초 연장\n" +
            "발동 시 1초 후 재사용 가능"
    },
    {
        id: "flash_bomb",
        englishName: "Flash Bomb",
        koreanName: "섬광 폭탄",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/flash_bomb.png",
        description: "사용 시:\n" +
            "섬광 폭탄 투척,\n" +
            "폭발 시 적 2초 기절 및 나약함 II 5초 부여\n" +
            "• 자신도 폭발 충격을 받으면 도약의 깃털 쿨다운 5초 적용\n" +
            "10초 후 재사용 가능"
    },
    /*{
        id: "frozen_golden_apple",
        englishName: "Frozen Golden Apple",
        koreanName: "frozen_golden_apple",
        grade: "shop",
        job: "none",
        imageUrl: "/relics/shop/frozen_golden_apple.png",
        description: ""
    },*/
    {
        id: "frozen_holy_water",
        englishName: "Frozen Holy Water",
        koreanName: "얼어붙은 성수",
        grade: "boss",
        job: "마법사수",
        imageUrl: "/relics/boss/frozen_holy_water.png",
        description: "\n" +
            "사용 시:\n" +
            "바라보는 방향으로 성수 투척\n" +
            "• 적중한 위치에 서리길 5초 설치\n" +
            "• 주변의 자신과 동료에게 흡수 II 5초 부여\n" +
            "15초 후 재사용 가능"
    },
    {
        id: "ghast_love_letter",
        englishName: "Ghast Love Letter",
        koreanName: "가스트의 러브레터",
        grade: "side",
        job: "기사,사냥꾼",
        imageUrl: "/relics/side/ghast_love_letter.png",
        description: "소지 시:\n" +
            "적의 공격을 반사해서 입히는 피해 +50"
    },
    {
        id: "goat_hoof",
        englishName: "Goat Hoof",
        koreanName: "염소 발굽",
        grade: "side",
        job: "기사",
        imageUrl: "/relics/side/goat_hoof.png",
        description: "소지 시:\n" +
            "강하게 밀쳐낸 적이 벽에 부딪치면 피해 부여\n" +
            "• 밀쳐진 힘에 비례, 최대 50"
    },
    {
        id: "golden_cross",
        englishName: "Golden Cross",
        koreanName: "황금 십자가",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/golden_cross.png",
        description: "사용 시:\n" +
            "사용하는 동안 허기를 소모하며,\n" +
            "자신과 16블록 내 동료가 받는 적의 공격 반사\n" +
            "• 해당 플레이어에게 흡수 I 10초 부여"
    },
    {
        id: "golden_dewdrop",
        englishName: "Golden Dewdrop",
        koreanName: "황금이슬",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/golden_dewdrop.png",
        description: "소지 시:\n" +
            "전투 시작 시마다 흡수 IV 5분 획득"
    },
    {
        id: "golden_holy_nail",
        englishName: "Golden Holy Nail",
        koreanName: "황금 성정",
        grade: "side",
        job: "기사,마법사수",
        imageUrl: "/relics/side/golden_holy_nail.png",
        description: "소지 시:\n" +
            "흡수 효과가 적용되어 있을 때,\n" +
            "흡수 체력만큼 적에게 입히는 피해 증가"
    },
    {
        id: "golden_mead",
        englishName: "Golden Mead",
        koreanName: "황금 벌꿀주",
        grade: "boss",
        job: "기사,마법사수",
        imageUrl: "/relics/boss/golden_mead.png",
        description: "섭취 시:\n" +
            "흡수 II 10초와 속도 증가 II 7초 획득\n" +
            "모든 동료에게 흡수 I 10초 부여\n" +
            "30초 후 재사용 가능"
    },
    /*{
        id: "golden_rose",
        englishName: "Golden Rose",
        koreanName: "golden_rose",
        grade: "side",
        job: "none",
        imageUrl: "/relics/side/golden_rose.png",
        description: ""
    },*/
    {
        id: "gospel",
        englishName: "Gospel",
        koreanName: "복음서",
        grade: "side",
        job: "기사,마법사수",
        imageUrl: "/relics/side/gospel.png",
        description: "소지 시:\n" +
            "흡수 효과가 적용되어 있을 때,\n" +
            "언데드 적에게 입히는 피해가 단계 ×15%만큼 증가"
    },
    {
        id: "greedy_sack",
        englishName: "Greedy Sack",
        koreanName: "욕망의 자루",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/greedy_sack.png",
        description: "소지 시:\n" +
            "소지한 루비 10개당 적에게 입히는 피해 2%씩 증가"
    },
    {
        id: "gunpowder_bundle",
        englishName: "Gunpowder Bundle",
        koreanName: "화약 주머니",
        grade: "side",
        job: "사냥꾼,마법사수",
        imageUrl: "/relics/side/gunpowder_bundle.png",
        description: "\n" +
            "소지 시:\n" +
            "적에게 입히는 폭발 피해 +50%"
    },
    /*{
        id: "headwind_charge",
        englishName: "Headwind Charge",
        koreanName: "headwind_charge",
        grade: "shop",
        job: "none",
        imageUrl: "/relics/shop/headwind_charge.png",
        description: ""
    },*/
    {
        id: "heavy_dumbbell",
        englishName: "Heavy Dumbbell",
        koreanName: "무거운 덤벨",
        grade: "side",
        job: "기사",
        imageUrl: "/relics/side/heavy_dumbbell.png",
        description: "소지 시:\n" +
            "획득하는 힘 효과의 지속시간 2배로 증폭"
    },
    {
        id: "hoglin_canine",
        englishName: "Hoglin Canine",
        koreanName: "호글린의 송곳니",
        grade: "side",
        job: "기사",
        imageUrl: "/relics/side/hoglin_canine.png",
        description: "소지 시:\n" +
            "적을 강하게 밀친 직후 5초간,\n" +
            "해당 적에게 입히는 다음 근접 공격의 피해 +50"
    },
    {
        id: "holy_torch",
        englishName: "Holy Torch",
        koreanName: "영험한 불꽃",
        grade: "boss",
        job: "마법사수",
        imageUrl: "/relics/boss/holy_torch.png",
        description: "사용 시:\n" +
            "16블록 내 적에게 20의 화염 피해 부여\n" +
            "자신과 16블록 내 동료에게 흡수 I 10초 부여\n" +
            "20초 후 재사용 가능"
    },
    {
        id: "honey_pot",
        englishName: "Honey Pot",
        koreanName: "꿀단지",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/honey_pot.png",
        description: "\n" +
            "소지 시:\n" +
            "독 및 시듦 피해 면역"
    },
    {
        id: "honeybee_scepter",
        englishName: "Honeybee Scepter",
        koreanName: "꿀벌 지휘봉",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/honeybee_scepter.png",
        description: "\n" +
            "소지 시:\n" +
            "적에게 공격을 받을 때마다 벌 소환, 최대 8마리\n" +
            "• 15초간 지속, 전투 종료 시 소멸\n" +
            "• 소환된 벌 한 마리당 적에게 입히는 피해 +5%\n" +
            "벌이 공격하는 적에게 시듦 II 5초 부여"
    },
    {
        id: "horned_helmet",
        englishName: "Horned Helmet",
        koreanName: "뿔투구",
        grade: "side",
        job: "기사",
        imageUrl: "/relics/side/horned_helmet.png",
        description: "소지 시:\n" +
            "방패 쿨다운이 적용 중일 때 물리 피해 30% 감소"
    },
    {
        id: "horseshoe",
        englishName: "Horseshoe",
        koreanName: "편자",
        grade: "side",
        job: "common",
        imageUrl: "/relics/side/horseshoe.png",
        description: "\n" +
            "소지 시:\n" +
            "속도 증가 효과가 적용되는 동안,\n" +
            "적에게 받는 근접 피해가 단계 ×20%만큼 감소"
    },
    {
        id: "hunter_lasso",
        englishName: "Hunter Lasso",
        koreanName: "사냥꾼의 올가미",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/hunter_lasso.png",
        description: "\n" +
            "소지 시:\n" +
            "적이 가진 부정적 상태 효과 하나당,\n" +
            "해당 적에게 입히는 피해 10%씩 증가"
    },
    {
        id: "husk_heart",
        englishName: "Husk Heart",
        koreanName: "허스크의 심장",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/husk_heart.png",
        description: "소지 시:\n" +
            "전투 중 자연적으로 체력이 회복되지 않음\n" +
            "음식 섭취로 채우는 허기만큼 체력 즉시 회복"
    },
    {
        id: "ice_tear",
        englishName: "Ice Tear",
        koreanName: "얼음 눈물",
        grade: "side",
        job: "마법사수",
        imageUrl: "/relics/side/ice_tear.png",
        description: "소지 시:\n" +
            "적에게 빙결 공격을 입힌 직후 5초간,\n" +
            "자신과 동료가 해당 적에게 입히는 피해 +30%\n" +
            "• 빙결 피해의 경우 두 배로 적용"
    },
    {
        id: "icicle",
        englishName: "Icicle",
        koreanName: "고드름",
        grade: "side",
        job: "마법사수",
        imageUrl: "/relics/side/icicle.png",
        description: "소지 시:\n" +
            "적에게 입히는 빙결 공격의 피해 +50%"
    },
    {
        id: "icy_spear",
        englishName: "Icy Spear",
        koreanName: "냉기의 창",
        grade: "boss",
        job: "마법사수",
        imageUrl: "/relics/boss/icy_spear.png",
        description: "사용 시:\n" +
            "적을 관통하는 냉기의 창 투척\n" +
            "• 날아간 자리에 서리길 10초 설치\n" +
            "• 적중한 적에게 20의 빙결 피해 부여\n" +
            "• 적을 공격할 때마다 속도 증가 II 5초 획득 혹은 연장\n" +
            "15초 후 재사용 가능"
    },
    {
        id: "indulgence",
        englishName: "Indulgence",
        koreanName: "면죄부",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/indulgence.png",
        description: "소지 시:\n" +
            "루비 획득량 50% 감소\n" +
            "최대 체력 4 증가"
    },
    {
        id: "instant_health_quiver",
        englishName: "Instant Health Quiver",
        koreanName: "즉시 회복 화살통",
        grade: "basic",
        job: "마법사수",
        imageUrl: "/relics/basic/instant_health_quiver.png",
        description: "소지 시:\n" +
            "화살 피해 +30% 및 즉시 치유 I 효과 적용\n" +
            "• 즉시 치유는 동료 치유 및 언데드에게 피해\n" +
            "적에게 화살 적중 시마다 마력 획득"
    },
    {
        id: "instant_health_rocket",
        englishName: "Instant Health Rocket",
        koreanName: "즉시 치유의 폭죽",
        grade: "basic",
        job: "마법사수",
        imageUrl: "/relics/basic/instant_health_rocket.png",
        description: "사용 시:\n" +
            "16 마력 소비,\n" +
            "쇠뇌에 즉시 치유의 폭죽 장전\n" +
            "• 주변 대상에 즉시 치유 III 효과 적용\n" +
            "• 스스로에게는 회복량 절반으로 감소"
    },
    /*{
        id: "instant_health_rocket_disabled",
        englishName: "Instant Health Rocket Disabled",
        koreanName: "instant_health_rocket_disabled",
        grade: "basic",
        job: "none",
        imageUrl: "/relics/basic/instant_health_rocket_disabled.png",
        description: ""
    },*/
    {
        id: "katana",
        englishName: "Katana",
        koreanName: "카타나",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/katana.png",
        description: "사용 시:\n" +
            "들고 사용하는 동안 받는 공격을 반사\n" +
            "• 이때 반사하는 피해 +50\n" +
            "• 적중한 적에게 나약함 II 10초 부여\n" +
            "최대 1초간 사용 가능\n" +
            "3초 후 재사용 가능, 반사 실패 시 1초 단축"
    },
    {
        id: "kunai",
        englishName: "Kunai",
        koreanName: "쿠나이",
        grade: "side",
        job: "사냥꾼",
        imageUrl: "/relics/side/kunai.png",
        description: "사용 시:\n" +
            "쿠나이 투척,\n" +
            "피격된 적이 나약함 효과를 가진 경우,\n" +
            "효과 단계 ×15의 피해 적용, 머리 적중 시 2.5배\n" +
            "15초 후 재사용 가능, 적 처치 시 즉시 초기화"
    },
    {
        id: "large_nail",
        englishName: "Large Nail",
        koreanName: "대못",
        grade: "side",
        job: "기사,사냥꾼",
        imageUrl: "/relics/side/large_nail.png",
        description: "소지 시:\n" +
            "반사한 공격을 적에게 입혔을 때:\n" +
            "• 적 1초간 기절\n" +
            "• 해당 적에게 입히는 다음 공격 피해 +50"
    },
    {
        id: "leather_bracer",
        englishName: "Leather Bracer",
        koreanName: "가죽 브레이서",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/leather_bracer.png",
        description: "\n" +
            "소지 시:\n" +
            "활 시위를 당길 때 받는 적의 공격을 반사,\n" +
            "3초 안에 해당 적 공격 시 즉사시킴\n" +
            "• 보스는 예외, 대신 피해 +50\n" +
            "4초 후 재사용 가능"
    },
    {
        id: "lightning_ball",
        englishName: "Lightning Ball",
        koreanName: "번개 구체",
        grade: "boss",
        job: "마법사수",
        imageUrl: "/relics/boss/lightning_ball.png",
        description: "소지 시:\n" +
            "엔더 진주로 텔레포트 할 때마다 해당 위치에 번개 소환,\n" +
            "8블록 내 적에게 15의 화염 피해 부여"
    },
    {
        id: "lightning_bulb",
        englishName: "Lightning Bulb",
        koreanName: "번개 전구",
        grade: "side",
        job: "마법사수",
        imageUrl: "/relics/side/lightning_bulb.png",
        description: "소지 시:\n" +
            "번개로 적에게 입히는 피해 +50%"
    },
    {
        id: "magic_mushroom",
        englishName: "Magic Mushroom",
        koreanName: "환각 버섯",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/magic_mushroom.png",
        description: "섭취 시:\n" +
            "30초간 다음 효과 적용:\n" +
            "• 방패 사용 불가\n" +
            "• 적에게 받는 최종 피해 +1\n" +
            "• 적에게 공격받을 때마다 힘 I 30초 획득\n" +
            "• 이미 힘 효과가 있다면 한 단계 증폭\n" +
            "60초 후 재사용 가능"
    },
    {
        id: "magma_cube_core",
        englishName: "Magma Cube Core",
        koreanName: "마그마 큐브 핵",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/magma_cube_core.png",
        description: "소지 시:\n" +
            "공중에서 웅크리면 빠르게 낙하,\n" +
            "이때 낙하 피해를 입지 않으며,\n" +
            "대신 2블록 내 적에게 15배의 피해를 입힘\n" +
            "동시에 스스로에게 10의 피해를 입힘"
    },
    {
        id: "mana_stone",
        englishName: "Mana Stone",
        koreanName: "마력을 머금은 돌",
        grade: "shop",
        job: "마법사수",
        imageUrl: "/relics/shop/mana_stone.png",
        description: "소지 시:\n" +
            "마력 최대 소지량 +8"
    },
    {
        id: "matryoshka",
        englishName: "Matryoshka",
        koreanName: "마트료시카",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/matryoshka.png",
        description: "소지 시:\n" +
            "리스폰 기회 소진 후 사망 시 1회 부활,\n" +
            "이때 최대 체력 10 감소"
    },
    {
        id: "meditation_orb",
        englishName: "Meditation Orb",
        koreanName: "명상의 구슬",
        grade: "side",
        job: "마법사수",
        imageUrl: "/relics/side/meditation_orb.png",
        description: "소지 시:\n" +
            "8블록 내에 적이 없을 때 마력 소모량 -15%"
    },
    /*{
        id: "meditation_orb_inactive",
        englishName: "Meditation Orb Inactive",
        koreanName: "meditation_orb_inactive",
        grade: "side",
        job: "none",
        imageUrl: "/relics/side/meditation_orb_inactive.png",
        description: ""
    },*/
    {
        id: "meteor_fragment",
        englishName: "Meteor Fragment",
        koreanName: "운석 조각",
        grade: "side",
        job: "기사",
        imageUrl: "/relics/side/meteor_fragment.png",
        description: "\n" +
            "소지 시:\n" +
            "떨어지는 동안 적의 공격 무시\n" +
            "대신 낙하 피해가 1.5배로 증폭"
    },
    {
        id: "mjolnir",
        englishName: "Mjolnir",
        koreanName: "뇌신 망치",
        grade: "boss",
        job: "마법사수",
        imageUrl: "/relics/boss/mjolnir.png",
        description: "사용 시:\n" +
            "되돌아오는 뇌신 망치 투척\n" +
            "• 날아가는 동안 5번 번개 소환, 적에게 30의 피해\n" +
            "• 적 적중 시 번개 소환 및 속도 증가 II 5초 획득\n" +
            "30초 후 재사용 가능"
    },
    {
        id: "musket",
        englishName: "Musket",
        koreanName: "머스킷",
        grade: "boss",
        job: "사냥꾼,마법사수",
        imageUrl: "/relics/boss/musket.png",
        description: "사용 시:\n" +
            "일직선으로 날아가는 탄환 조준,\n" +
            "탄환이 적을 관통할 때마다 해당 위치에 폭발 발생\n" +
            "• 이때 적의 머리 적중 시 폭발 피해량 +50%\n" +
            "큰반동과 함께 스스로에게 10의 피해를 입힘\n" +
            "5초 후 재사용 가능"
    },
    {
        id: "necronomicon",
        englishName: "Necronomicon",
        koreanName: "네크로노미콘",
        grade: "side",
        job: "사냥꾼",
        imageUrl: "/relics/side/necronomicon.png",
        description: "소지 시:\n" +
            "적에게 부여하는 시듦 효과를 한 단계 증폭"
    },
    {
        id: "nimble_gloves",
        englishName: "Nimble Gloves",
        koreanName: "재빠른 장갑",
        grade: "shop",
        job: "마법사수",
        imageUrl: "/relics/side/nimble_gloves.png",
        description: "소지 시:\n" +
            "발사한 화살 직접 회수 시 즉시 장전"
    },
    /*{
        id: "nunchaku",
        englishName: "Nunchaku",
        koreanName: "nunchaku",
        grade: "side",
        job: "none",
        imageUrl: "/relics/side/nunchaku.png",
        description: ""
    },*/
    {
        id: "obsidian_arrowhead",
        englishName: "Obsidian Arrowhead",
        koreanName: "흑요석 화살촉",
        grade: "basic",
        job: "사냥꾼",
        imageUrl: "/relics/basic/obsidian_arrowhead.png",
        description: "\n" +
            "소지 시:\n" +
            "화살이 머리에 적중하면 피해 +50%"
    },
    {
        id: "old_key",
        englishName: "Old Key",
        koreanName: "오래된 열쇠",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/old_key.png",
        description: "소지 시:\n" +
            "일반 유물 상자의 선택지 1개 증가"
    },
    {
        id: "oxidized_heart",
        englishName: "Oxidized Heart",
        koreanName: "녹슨 심장",
        grade: "side",
        job: "마법사수",
        imageUrl: "/relics/side/oxidized_heart.png",
        description: "\n" +
            "소지 시:\n" +
            "적에게 번개 피해를 입힌 직후 5초간,\n" +
            "해당 적에게 입히는 피해 +50%"
    },
    {
        id: "paper_airplane",
        englishName: "Paper Airplane",
        koreanName: "종이비행기",
        grade: "side",
        job: "common",
        imageUrl: "/relics/side/paper_airplane.png",
        description: "소지 시:\n" +
            "획득하는 속도 증가 효과의 지속시간 1.5배로 증폭"
    },
    {
        id: "permanent_snow_bucket",
        englishName: "Permanent Snow Bucket",
        koreanName: "만년설 양동이",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/permanent_snow_bucket.png",
        description: "사용 시:\n" +
            "바라보는 곳에 스노우 골렘 소환\n" +
            "• 해당 위치에서 움직이지 않음\n" +
            "• 적에게 눈덩이 발사, 20의 피해 및 나약함 II 5초 부여\n" +
            "• 30초간 지속, 전투 종료 시 소멸\n" +
            "재사용 시 소환된 스노우 골렘 소멸\n" +
            "30초 후 재사용 가능"
    },
    {
        id: "permanent_stew",
        englishName: "Permanent Stew",
        koreanName: "만년스튜",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/permanent_stew.png",
        description: "섭취 시:\n" +
            "체력 및 허기 전부 회복\n" +
            "60초 후 재사용 가능, 적 처치 시마다 쿨다운 5초 단축"
    },
    {
        id: "piglin_hatchet",
        englishName: "Piglin Hatchet",
        koreanName: "피글린 손도끼",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/piglin_hatchet.png",
        description: "사용 시:\n" +
            "적들을 강하게 밀쳐내는 도끼 투척\n" +
            "적중한 적에게 30의 피해 부여\n" +
            "• 이때 힘 V 20초 획득\n" +
            "• 이미 힘 효과가 있다면 한 단계 증폭\n" +
            "10초 후 재사용 가능"
    },
    {
        id: "pinwheel",
        englishName: "Pinwheel",
        koreanName: "바람개비",
        grade: "side",
        job: "common",
        imageUrl: "/relics/side/pinwheel.png",
        description: "\n" +
            "소지 시:\n" +
            "속도 증가 효과가 적용되는 동안,\n" +
            "적에게 받는 발사체 피해가 단계 ×20%만큼 감소"
    },
    {
        id: "plague_mask",
        englishName: "Plague Mask",
        koreanName: "역병 가면",
        grade: "side",
        job: "사냥꾼",
        imageUrl: "/relics/side/plague_mask.png",
        description: "소지 시:\n" +
            "시듦 효과를 가진 적을 공격할 때마다,\n" +
            "근처 16블록 내 적들에게도 동일 효과 부여"
    },
    {
        id: "pocket_watch",
        englishName: "Pocket Watch",
        koreanName: "회중시계",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/pocket_watch.png",
        description: "소지 시:\n" +
            "30초 이상의 모든 유물 쿨다운 15초 단축"
    },
    {
        id: "poisoned_chalice",
        englishName: "Poisoned Chalice",
        koreanName: "독이 든 성배",
        grade: "boss",
        job: "기사,마법사수",
        imageUrl: "/relics/boss/poisoned_chalice.png",
        description: "섭취 시:\n" +
            "스스로에게 6의 피해를 입히며, 흡수 II 30초 획득\n" +
            "모든 동료에게 흡수 II 30초 부여\n" +
            "20초 후 재사용 가능"
    },
    {
        id: "prewound_spring",
        englishName: "Prewound Spring",
        koreanName: "미리 감아둔 태엽",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/prewound_spring.png",
        description: "소지 시:\n" +
            "보스 등장 직후 10초간,\n" +
            "30초 이하의 모든 유물 쿨다운이 1초로 적용"
    },
    {
        id: "prism",
        englishName: "Prism",
        koreanName: "프리즘",
        grade: "side",
        job: "기사,사냥꾼",
        imageUrl: "/relics/side/prism.png",
        description: "소지 시:\n" +
            "반사한 발사체가 적을 적중할 때:\n" +
            "• 적이 받는 피해 +50\n" +
            "• 대상 주위 8블록 내 적에게 동일 피해 확산\n" +
            "5초 후 재사용 가능"
    },
    {
        id: "raven_feather",
        englishName: "Raven Feather",
        koreanName: "까마귀 깃털",
        grade: "side",
        job: "사냥꾼",
        imageUrl: "/relics/side/raven_feather.png",
        description: "소지 시:\n" +
            "즉사 공격으로 적을 처치할 때마다 재생 II 3초 획득"
    },
    {
        id: "reaper_scythe",
        englishName: "Reaper Scythe",
        koreanName: "사신의 낫",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/reaper_scythe.png",
        description: "사용 시:\n" +
            "체력이 절반 이하인 모든 적을 즉사시킴\n" +
            "• 보스는 예외, 대신 30의 피해 부여\n" +
            "동시에 속도 증가 II 5초 획득\n" +
            "15초 후 재사용 가능"
    },
    {
        id: "recovery_serum",
        englishName: "Recovery Serum",
        koreanName: "재생 혈청",
        grade: "side",
        job: "common",
        imageUrl: "/relics/side/recovery_serum.png",
        description: "소지 시:\n" +
            "스스로에게 피해를 입힐 때마다 재생 I 획득\n" +
            "• 해당 피해량 ×1초만큼 지속"
    },
    {
        id: "royal_key",
        englishName: "Royal Key",
        koreanName: "왕실 열쇠",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/royal_key.png",
        description: "소지 시:\n" +
            "보스 유물 상자의 유물 선택지 1개 증가"
    },
    {
        id: "russian_roulette",
        englishName: "Russian Roulette",
        koreanName: "러시안 룰렛",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/russian_roulette.png",
        description: "사용 시:\n" +
            "한 개의 실탄이 장전된 6연발 리볼버를 자신에게 사격\n" +
            "실탄이 발사될 경우 즉사 및 유물 소멸,\n" +
            "그 외의 경우 체력 전부 회복 및 저항 I 3분 획득"
    },
    {
        id: "shadow_scimitar",
        englishName: "Shadow Scimitar",
        koreanName: "그림자 시미터",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/shadow_scimitar.png",
        description: "들고 있을 때:\n" +
            "다른 손에 무기를 든 상태에서,\n" +
            "우클릭으로 휘둘러 적의 공격 반사 가능\n" +
            "• 이때 반사하는 피해 +50\n" +
            "• 반사 성공 시 속도 증가 II 5초 획득\n" +
            "3초 후 재사용 가능, 반사 실패 시 2초 단축\n" +
            "• 반사한 발사체 적중 시 즉시 초기화"
    },
    {
        id: "sharp_horn",
        englishName: "Sharp Horn",
        koreanName: "날카로운 뿔",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/sharp_horn.png",
        description: "소지 시:\n" +
            "적마다 입히는 최초 피해 +100%"
    },
    {
        id: "shattered_glass",
        englishName: "Shattered Glass",
        koreanName: "깨진 유리잔",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/shattered_glass.png",
        description: "소지 시:\n" +
            "적에게 입히는 모든 공격 피해 +50%\n" +
            "적에게 받는 근접 피해 +30%"
    },
    {
        id: "shield_repair_kit",
        englishName: "Shield Repair Kit",
        koreanName: "방패 수리 키트",
        grade: "basic",
        job: "기사",
        imageUrl: "/relics/basic/shield_repair_kit.png",
        description: "소지 시:\n" +
            "방패를 사용하지 않을 때 자동 수리\n" +
            "방패가 부숴지면 7초 후 복구"
    },
    {
        id: "shuriken",
        englishName: "Shuriken",
        koreanName: "표창",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/shuriken.png",
        description: "사용 시:\n" +
            "4개의 표창을 연달아 투척,\n" +
            "적중한 적에게 15의 피해 부여, 머리 적중 시 1.5배,\n" +
            "동시에 시듦 II 5초, 나약함 II 5초 부여\n" +
            "7초 후 재사용 가능"
    },
    {
        id: "skull_dice",
        englishName: "Skull Dice",
        koreanName: "해골 주사위",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/skull_dice.png",
        description: "사용 시:\n" +
            "스스로에게 8의 피해를 입힘\n" +
            "무작위로 1~6 범위의 눈금 결정,\n" +
            "해당 눈금 ×10%만큼 보스와 서로 주고받는 피해 증가\n" +
            "1초 후 재사용 가능"
    },
    /*{
        id: "skull_eyepatch",
        englishName: "Skull Eyepatch",
        koreanName: "skull_eyepatch",
        grade: "shop",
        job: "none",
        imageUrl: "/relics/shop/skull_eyepatch.png",
        description: ""
    },*/
    {
        id: "slime_boots",
        englishName: "Slime Boots",
        koreanName: "슬라임 부츠",
        grade: "side",
        job: "기사",
        imageUrl: "/relics/side/slime_boots.png",
        description: "소지 시:\n" +
            "웅크리기 후 점프 시 수직으로 크게 도약\n" +
            "15초 후 재사용 가능"
    },
    {
        id: "slime_stew",
        englishName: "Slime Stew",
        koreanName: "슬라임 스튜",
        grade: "boss",
        job: "기사,사냥꾼",
        imageUrl: "/relics/boss/slime_stew.png",
        description: "섭취 시:\n" +
            "스스로에게 4의 피해를 입히며,\n" +
            "적에게 다음으로 받는 공격을 1회 반사시킴\n" +
            "• 이때 반사하는 피해 +50\n" +
            "섭취하는 만큼 반사할 횟수 누적 가능\n" +
            "• 최대 5회, 전투 종료 시 초기화"
    },
    {
        id: "small_bell",
        englishName: "Small Bell",
        koreanName: "금방울",
        grade: "side",
        job: "사냥꾼",
        imageUrl: "/relics/side/small_bell.png",
        description: "사용 시:\n" +
            "소환수의 지속시간 1.5배로 증폭"
    },
    {
        id: "small_drum",
        englishName: "Small Drum",
        koreanName: "작은 북",
        grade: "shop",
        job: "기사",
        imageUrl: "/relics/shop/small_drum.png",
        description: "\n" +
            "소지 시:\n" +
            "방패 방어로 획득하는 분노 +100%\n" +
            "방패 사용 중에 지속적으로 분노 소모"
    },
    {
        id: "snail_house",
        englishName: "Snail House",
        koreanName: "달팽이집",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/snail_house.png",
        description: "소지 시:\n" +
            "웅크리는 동안 이동속도 50% 감소,\n" +
            "동시에 적에게 받는 물리 피해 50% 방어\n" +
            "이때 내구도 5% 소모, 전투 종료 시 회복"
    },
    {
        id: "snow_globe",
        englishName: "Snow Globe",
        koreanName: "스노글로브",
        grade: "side",
        job: "마법사수",
        imageUrl: "/relics/side/snow_globe.png",
        description: "소지 시:\n" +
            "빙결 피해가 적중한 적에게 다음 효과 적용:\n" +
            "• 속도 감소 II 3초 부여\n" +
            "• 5초간 해당 적에게 받는 피해 50% 감소"
    },
    {
        id: "someones_last_will",
        englishName: "Someones Last Will",
        koreanName: "누군가의 유서",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/someones_last_will.png",
        description: "소지 시:\n" +
            "리스폰 기회가 0일 때 적에게 입히는 피해 +20%"
    },
    {
        id: "soul_crystal",
        englishName: "Soul Crystal",
        koreanName: "영혼 수정",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/soul_crystal.png",
        description: "소지 시:\n" +
            "적에게 입히는 모든 공격 피해 +10\n" +
            "폭발에 의해 받는 피해 +50%"
    },
    {
        id: "soul_fire_candle",
        englishName: "Soul Fire Candle",
        koreanName: "영혼불 양초",
        grade: "side",
        job: "마법사수",
        imageUrl: "/relics/side/soul_fire_candle.png",
        description: "소지 시:\n" +
            "웅크리고 있을 때 다음 효과 적용:\n" +
            "• 마력 소모량 -15%\n" +
            "• 적에게 받는 피해 +50%"
    },
    /*{
        id: "soul_fire_candle_using",
        englishName: "Soul Fire Candle Using",
        koreanName: "soul_fire_candle_using",
        grade: "side",
        job: "none",
        imageUrl: "/relics/side/soul_fire_candle_using.png",
        description: ""
    },*/
    {
        id: "soul_pipe",
        englishName: "Soul Pipe",
        koreanName: "영혼불 담뱃대",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/soul_pipe.png",
        description: "사용 시:\n" +
            "힘 II 20초 획득,\n" +
            "이미 힘 효과가 있다면 두 단계 증폭\n" +
            "동시에 스스로에게 6의 피해를 입힘"
    },
    {
        id: "spiked_ball",
        englishName: "Spiked Ball",
        koreanName: "가시 철구",
        grade: "side",
        job: "기사",
        imageUrl: "/relics/side/spiked_ball.png",
        description: "소지 시:\n" +
            "힘 효과의 공격력 증가량 +50%"
    },
    {
        id: "spiked_club",
        englishName: "Spiked Club",
        koreanName: "가시 곤봉",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/spiked_club.png",
        description: "사용 시:\n" +
            "전방의 적들을 강하게 밀쳐내며 30의 피해 부여\n" +
            "• 밀쳐낸 적이 다른 적과 충돌하면 서로 70의 피해 추가 부여\n" +
            "4초간 방패 사용 불가\n" +
            "7초 후 재사용 가능"
    },
    {
        id: "spiked_collar",
        englishName: "Spiked Collar",
        koreanName: "스파이크 목걸이",
        grade: "side",
        job: "사냥꾼",
        imageUrl: "/relics/side/spiked_collar.png",
        description: "소지 시:\n" +
            "자신의 소환수가 적에게 입히는 피해 +50%"
    },
    {
        id: "staff_of_fireball",
        englishName: "Staff Of Fireball",
        koreanName: "화염구 지팡이",
        grade: "boss",
        job: "마법사수",
        imageUrl: "/relics/boss/staff_of_fireball.png",
        description: "사용 시:\n" +
            "바라보는 천장에 낙하하는 화염구 소환\n" +
            "• 폭발 충격을 받은 적에게 20의 화염 피해 부여\n" +
            "10초 후 재사용 가능"
    },
    {
        id: "staff_of_frost_flower",
        englishName: "Staff Of Frost Flower",
        koreanName: "얼음꽃 지팡이",
        grade: "boss",
        job: "마법사수",
        imageUrl: "/relics/boss/staff_of_frost_flower.png",
        description: "\n" +
            "사용 시:\n" +
            "전방에 솟아나는 얼음 가시 소환\n" +
            "• 적중한 적에게 100의 빙결 피해 부여\n" +
            "동시에 스스로에게 5의 피해를 입힘\n" +
            "1초 후 재사용 가능"
    },
    {
        id: "tasty_bone",
        englishName: "Tasty Bone",
        koreanName: "맛있는 뼈다귀",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/tasty_bone.png",
        description: "소지 시:\n" +
            "적을 처치할 때마다 늑대 소환, 최대 5마리\n" +
            "• 15초간 지속, 전투 종료 시 소멸\n" +
            "• 소환된 늑대 한 마리당 적에게 입히는 피해 +20%\n" +
            "늑대가 적을 공격할 때마다 속도 증가 I 0.5초 획득 혹은 연장"
    },
    {
        id: "thorn_crown",
        englishName: "Thorn Crown",
        koreanName: "가시 왕관",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/thorn_crown.png",
        description: "소지 시:\n" +
            "보스에게 입히는 피해 +50%\n" +
            "보스가 아닌 적에게 받는 피해 +30%"
    },
    {
        id: "thorned_heart",
        englishName: "Thorned Heart",
        koreanName: "가시 심장",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/thorned_heart.png",
        description: "소지 시:\n" +
            "자신의 체력이 절반 이하일 때 적에게 입히는 피해 +50%"
    },
    {
        id: "thorny_chain",
        englishName: "Thorny Chain",
        koreanName: "가시 사슬",
        grade: "side",
        job: "사냥꾼",
        imageUrl: "/relics/side/thorny_chain.png",
        description: "소지 시:\n" +
            "보스에게 즉사 공격을 입힐 때 50의 피해 부여"
    },
    /*{
        id: "throwing_tnt",
        englishName: "Throwing Tnt",
        koreanName: "throwing_tnt",
        grade: "side",
        job: "none",
        imageUrl: "/relics/side/throwing_tnt.png",
        description: ""
    },*/
    {
        id: "thunderbolt_shard",
        englishName: "Thunderbolt Shard",
        koreanName: "번개 조각",
        grade: "boss",
        job: "마법사수",
        imageUrl: "/relics/boss/thunderbolt_shard.png",
        description: "\n" +
            "사용 시:\n" +
            "무작위 적에게 번개 소환, 70의 피해 부여\n" +
            "동시에 스스로에게 8의 피해를 입힘\n" +
            "1초 후 재사용 가능"
    },
    {
        id: "tooth_necklace",
        englishName: "Tooth Necklace",
        koreanName: "이빨 목걸이",
        grade: "side",
        job: "기사",
        imageUrl: "/relics/side/tooth_necklace.png",
        description: "소지 시:\n" +
            "방패 쿨다운이 적용 중일 때,\n" +
            "적에게 근접 공격을 입힐 때마다 분노 +5"
    },
    {
        id: "totem_of_iron_golem",
        englishName: "Totem Of Iron Golem",
        koreanName: "철 골렘 토템",
        grade: "boss",
        job: "사냥꾼",
        imageUrl: "/relics/boss/totem_of_iron_golem.png",
        description: "사용 시:\n" +
            "자신의 위치에 철 골렘 소환\n" +
            "• 철 골렘 근처 16블록 내에서 적에게 입히는 피해 +100%\n" +
            "• 해당 범위를 벗어나면 1초마다 스스로에게 3의 피해를 입힘\n" +
            "• 30초간 지속, 전투 종료 시 소멸\n" +
            "재사용 시 소환된 철 골렘 소멸\n" +
            "30초 후 재사용 가능"
    },
    {
        id: "toy_ball",
        englishName: "Toy Ball",
        koreanName: "장난감 공",
        grade: "side",
        job: "사냥꾼",
        imageUrl: "/relics/side/toy_ball.png",
        description: "소지 시:\n" +
            "자신의 소환수가 적에게 피해를 입힐 때마다,\n" +
            "해당 피해의 30%만큼 다음 화살 공격의 피해량 증가\n" +
            "• 중첩하여 피해량 누적 가능, 최대 200"
    },
    {
        id: "unbreaking_mirror",
        englishName: "Unbreaking Mirror",
        koreanName: "깨지지 않는 거울",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/unbreaking_mirror.png",
        description: "소지 시:\n" +
            "방패로 적의 공격을 반사 가능\n" +
            "• 이때 반사하는 피해 +50\n" +
            "• 반사 시 3초간 방패 사용 불가"
    },
    {
        id: "volcanic_ash",
        englishName: "Volcanic Ash",
        koreanName: "화산재",
        grade: "side",
        job: "사냥꾼,마법사수",
        imageUrl: "/relics/side/volcanic_ash.png",
        description: "\n" +
            "소지 시:\n" +
            "적에게 폭발 피해를 준 직후 5초간,\n" +
            "해당 적에게 입히는 피해 +50%"
    },
    /*{
        id: "voodoo_doll",
        englishName: "Voodoo Doll",
        koreanName: "voodoo_doll",
        grade: "side",
        job: "none",
        imageUrl: "/relics/side/voodoo_doll.png",
        description: ""
    },*/
    {
        id: "weak_point_guide",
        englishName: "Weak Point Guide",
        koreanName: "약점도감",
        grade: "side",
        job: "사냥꾼",
        imageUrl: "/relics/side/weak_point_guide.png",
        description: "소지 시:\n" +
            "적에게 부여하는 나약함 효과를 한 단계 증폭"
    },
    {
        id: "whip",
        englishName: "Whip",
        koreanName: "채찍",
        grade: "side",
        job: "사냥꾼",
        imageUrl: "/relics/side/whip.png",
        description: "소지 시:\n" +
            "나약함 효과를 가진 적에게,\n" +
            "효과 단계 ×25%만큼 입히는 피해 증가"
    },
    {
        id: "whispering_flame",
        englishName: "Whispering Flame",
        koreanName: "속삭이는 불꽃",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/whispering_flame.png",
        description: "사용 시:\n" +
            "무작위 일반 유물 하나를 소멸시키고 리스폰 기회 1개 충전\n" +
            "전투 중 사용 불가, 사용 시 유물 소멸"
    },
    {
        id: "wind_blunderbuss",
        englishName: "Wind Blunderbuss",
        koreanName: "돌풍 나팔총",
        grade: "boss",
        job: "사냥꾼,마법사수",
        imageUrl: "/relics/boss/wind_blunderbuss.png",
        description: "사용 시:\n" +
            "전방에 폭발을 일으킴\n" +
            "큰 반동과 함께 속도 증가 II 5초 획득\n" +
            "12초 후 재사용 가능"
    },
    {
        id: "wing_boots",
        englishName: "Wing Boots",
        koreanName: "날개 달린 신발",
        grade: "boss",
        job: "기사",
        imageUrl: "/relics/boss/wing_boots.png",
        description: "소지 시:\n" +
            "낙하 피해를 입지 않으며,\n" +
            "대신 8블록 내 적에게 3배의 피해를 입힘\n" +
            "이때 적 하나 당 분노 15 획득,\n" +
            "동시에 적 수 ×1초 지속의 속도 증가 II 획득"
    },
    {
        id: "witch_amulet",
        englishName: "Witch Amulet",
        koreanName: "마녀의 부적",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/witch_amulet.png",
        description: "소지 시:\n" +
            "획득하는 모든 상태 효과를 한 단계 증폭,\n" +
            "동시에 지속시간은 절반으로 감소"
    },
    {
        id: "witch_choker",
        englishName: "Witch Choker",
        koreanName: "마녀의 초커",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/witch_choker.png",
        description: "소지 시:\n" +
            "다음 층에 도달할 때마다 리스폰 기회 1 충전"
    },
    {
        id: "zombified_piglin_tooth",
        englishName: "Zombified Piglin Tooth",
        koreanName: "좀비 피글린의 이빨",
        grade: "side",
        job: "기사",
        imageUrl: "/relics/side/zombified_piglin_tooth.png",
        description: "소지 시:\n" +
            "방패 쿨다운이 적용 중일 때 근접 공격력 +15"
    },
    {
        id: "unstoppable_spinning_top",
        englishName: "Unstoppable Spinning Top",
        koreanName: "멈추지 않는 팽이",
        grade: "shop",
        job: "common",
        imageUrl: "/relics/shop/unstoppable_spinning_top.png",
        description: "소지 시:\n" +
            "보스가 아닌 적에게 받는 피해 +20%\n" +
            "적 처치 시마다 모든 유물 쿨다운 4초 단축"
    }
];
