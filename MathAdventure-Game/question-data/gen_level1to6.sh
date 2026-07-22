#!/bin/bash

mkdir -p questions

#########################################################
# Generate Level 1
# Cộng trừ trong phạm vi 10
#########################################################

generate_level1() {

outfile="level1.js"

echo "window.level1Questions = [" > "$outfile"

count=0

while [ $count -lt 100 ]
do

    if [ $((RANDOM%2)) -eq 0 ]
    then
        a=$((RANDOM%11))
        b=$((RANDOM%(11-a)))
        ans=$((a+b))
        topic="Cộng cơ bản"
        prompt="$a + $b = ?"
    else
        a=$((RANDOM%11))
        b=$((RANDOM%(a+1)))
        ans=$((a-b))
        topic="Trừ cơ bản"
        prompt="$a - $b = ?"
    fi

    echo "  { prompt: '$prompt', answer: $ans, topic: '$topic' }," >> "$outfile"

    ((count++))

done

echo "];" >> "$outfile"

}



#########################################################
# Generate Level 2
# Cộng trừ 2 chữ số
#########################################################

generate_level2() {

outfile="level2.js"

echo "window.level2Questions = [" > "$outfile"

count=0

while [ $count -lt 100 ]
do

    if [ $((RANDOM%2)) -eq 0 ]
    then

        a=$((RANDOM%90+10))
        b=$((RANDOM%90+10))

        ans=$((a+b))

        topic="Cộng 2 chữ số"

        prompt="$a + $b = ?"

    else

        a=$((RANDOM%90+10))
        b=$((RANDOM%90+10))

        if [ $b -gt $a ]
        then
            tmp=$a
            a=$b
            b=$tmp
        fi

        ans=$((a-b))

        topic="Trừ 2 chữ số"

        prompt="$a - $b = ?"

    fi

    echo "  { prompt: '$prompt', answer: $ans, topic: '$topic' }," >> "$outfile"

    ((count++))

done

echo "];" >> "$outfile"

}



#########################################################
# Generate Level 3
# Cộng trừ 3 chữ số
#########################################################

generate_level3() {

outfile="level3.js"

echo "window.level3Questions = [" > "$outfile"

count=0

while [ $count -lt 100 ]
do

    if [ $((RANDOM%2)) -eq 0 ]
    then

        a=$((RANDOM%900+100))
        b=$((RANDOM%900+100))

        ans=$((a+b))

        topic="Cộng 3 chữ số"

        prompt="$a + $b = ?"

    else

        a=$((RANDOM%900+100))
        b=$((RANDOM%900+100))

        if [ $b -gt $a ]
        then
            tmp=$a
            a=$b
            b=$tmp
        fi

        ans=$((a-b))

        topic="Trừ 3 chữ số"

        prompt="$a - $b = ?"

    fi

    echo "  { prompt: '$prompt', answer: $ans, topic: '$topic' }," >> "$outfile"

    ((count++))

done

echo "];" >> "$outfile"

}

#########################################################
# Generate Level 4
# Đơn vị đo: cm dm m km
#########################################################

generate_level4() {

outfile="level4.js"

echo "window.level4Questions = [" > "$outfile"

count=0

while [ $count -lt 100 ]
do

    type=$((RANDOM%10))

    case $type in

    #################################################
    # m -> cm
    #################################################
    0)

        m=$((RANDOM%20+1))

        prompt="$m m = ? cm"

        ans=$((m*100))

        topic="Đổi đơn vị"

        ;;

    #################################################
    # dm -> cm
    #################################################
    1)

        dm=$((RANDOM%90+10))

        prompt="$dm dm = ? cm"

        ans=$((dm*10))

        topic="Đổi đơn vị"

        ;;

    #################################################
    # km -> m
    #################################################
    2)

        km=$((RANDOM%9+1))

        prompt="$km km = ? m"

        ans=$((km*1000))

        topic="Đổi đơn vị"

        ;;

    #################################################
    # cm -> m
    #################################################
    3)

        m=$((RANDOM%20+1))

        cm=$((m*100))

        prompt="$cm cm = ? m"

        ans=$m

        topic="Đổi đơn vị"

        ;;

    #################################################
    # cm -> dm
    #################################################
    4)

        dm=$((RANDOM%20+1))

        cm=$((dm*10))

        prompt="$cm cm = ? dm"

        ans=$dm

        topic="Đổi đơn vị"

        ;;

    #################################################
    # m + cm
    #################################################
    5)

        m=$((RANDOM%10+1))

        cm=$((RANDOM%90+10))

        prompt="$m m + $cm cm = ? cm"

        ans=$((m*100+cm))

        topic="Cộng đơn vị"

        ;;

    #################################################
    # m - cm
    #################################################
    6)

        m=$((RANDOM%10+2))

        cm=$((RANDOM%90+10))

        prompt="$m m - $cm cm = ? cm"

        ans=$((m*100-cm))

        topic="Trừ đơn vị"

        ;;

    #################################################
    # dm + cm
    #################################################
    7)

        dm=$((RANDOM%20+1))

        cm=$((RANDOM%90+10))

        prompt="$dm dm + $cm cm = ? cm"

        ans=$((dm*10+cm))

        topic="Cộng đơn vị"

        ;;

    #################################################
    # dm - cm
    #################################################
    8)

        dm=$((RANDOM%20+5))

        cm=$((RANDOM%50+10))

        prompt="$dm dm - $cm cm = ? cm"

        ans=$((dm*10-cm))

        topic="Trừ đơn vị"

        ;;

    #################################################
    # km + m
    #################################################
    9)

        km=$((RANDOM%5+1))

        m=$((RANDOM%900+100))

        prompt="$km km + $m m = ? m"

        ans=$((km*1000+m))

        topic="Cộng đơn vị"

        ;;

    esac

    echo "  { prompt: '$prompt', answer: $ans, topic: '$topic' }," >> "$outfile"

    ((count++))

done

echo "];" >> "$outfile"

}


#########################################################
# Generate Level 5
# Bài toán có lời văn (Cộng/Trừ)
#########################################################

generate_level5() {

outfile="level5.js"

echo "window.level5Questions = [" > "$outfile"

names=(
"Lan"
"Minh"
"Nam"
"Hoa"
"An"
"Mai"
"Bình"
"Phúc"
"Linh"
"Huy"
)

items=(
"quả táo"
"viên bi"
"quyển sách"
"cây bút"
"quả cam"
"bông hoa"
"chiếc kẹo"
"quả bóng"
"chiếc bánh"
"quyển vở"
)

count=0

while [ $count -lt 100 ]
do

name=${names[$RANDOM%${#names[@]}]}
item=${items[$RANDOM%${#items[@]}]}

type=$((RANDOM%8))

case $type in

#################################################
# Cho thêm
#################################################

0)

a=$((RANDOM%40+10))
b=$((RANDOM%30+1))

prompt="$name có $a $item. Mẹ cho thêm $b $item. $name có tất cả bao nhiêu $item?"

ans=$((a+b))

;;

#################################################
# Cho bớt
#################################################

1)

a=$((RANDOM%50+30))
b=$((RANDOM%20+5))

prompt="$name có $a $item. $name cho bạn $b $item. $name còn lại bao nhiêu $item?"

ans=$((a-b))

;;

#################################################
# Mua thêm
#################################################

2)

a=$((RANDOM%50+10))
b=$((RANDOM%30+1))

prompt="$name mua $a $item, sau đó mua thêm $b $item. Hỏi $name có bao nhiêu $item?"

ans=$((a+b))

;;

#################################################
# Ăn bớt
#################################################

3)

a=$((RANDOM%40+20))
b=$((RANDOM%15+5))

prompt="$name có $a $item. $name sử dụng hết $b $item. Hỏi còn lại bao nhiêu $item?"

ans=$((a-b))

;;

#################################################
# Hai bạn
#################################################

4)

a=$((RANDOM%30+10))
b=$((RANDOM%30+10))

name2=${names[$RANDOM%${#names[@]}]}

prompt="$name có $a $item. $name2 có $b $item. Cả hai có tất cả bao nhiêu $item?"

ans=$((a+b))

;;

#################################################
# Thu hoạch
#################################################

5)

a=$((RANDOM%80+20))
b=$((RANDOM%50+10))

prompt="Một vườn cây thu hoạch được $a $item vào buổi sáng và $b $item vào buổi chiều. Hỏi cả ngày thu hoạch được bao nhiêu $item?"

ans=$((a+b))

;;

#################################################
# Cửa hàng
#################################################

6)

a=$((RANDOM%80+40))
b=$((RANDOM%30+10))

prompt="Một cửa hàng có $a $item. Đã bán $b $item. Hỏi cửa hàng còn bao nhiêu $item?"

ans=$((a-b))

;;

#################################################
# Thư viện
#################################################

7)

a=$((RANDOM%100+50))
b=$((RANDOM%50+10))

prompt="Thư viện có $a quyển sách. Mua thêm $b quyển sách. Hỏi thư viện hiện có bao nhiêu quyển sách?"

ans=$((a+b))

;;

esac

echo "  { prompt: '$prompt', answer: $ans, topic: 'Bài toán có lời văn' }," >> "$outfile"

((count++))

done

echo "];" >> "$outfile"

}


#########################################################
# Generate Level 6
# Hình học cơ bản
#########################################################

generate_level6() {

outfile="level6.js"

echo "window.level6Questions = [" > "$outfile"

count=0

while [ $count -lt 100 ]
do

type=$((RANDOM%10))

case $type in

#################################################
# Tam giác
#################################################

0)

prompt="Hình tam giác có mấy cạnh?"

ans=3

topic="Hình học"

;;

#################################################
# Tam giác góc
#################################################

1)

prompt="Hình tam giác có mấy góc?"

ans=3

topic="Hình học"

;;

#################################################
# Hình vuông cạnh
#################################################

2)

prompt="Hình vuông có mấy cạnh?"

ans=4

topic="Hình học"

;;

#################################################
# Hình vuông góc
#################################################

3)

prompt="Hình vuông có mấy góc?"

ans=4

topic="Hình học"

;;

#################################################
# Hình chữ nhật cạnh
#################################################

4)

prompt="Hình chữ nhật có mấy cạnh?"

ans=4

topic="Hình học"

;;

#################################################
# Hình chữ nhật góc
#################################################

5)

prompt="Hình chữ nhật có mấy góc?"

ans=4

topic="Hình học"

;;

#################################################
# Chu vi hình vuông
#################################################

6)

side=$((RANDOM%15+2))

prompt="Chu vi hình vuông có cạnh ${side} cm là bao nhiêu cm?"

ans=$((side*4))

topic="Chu vi"

;;

#################################################
# Chu vi hình chữ nhật
#################################################

7)

length=$((RANDOM%20+5))

width=$((RANDOM%10+2))

prompt="Chu vi hình chữ nhật dài ${length} cm, rộng ${width} cm là bao nhiêu cm?"

ans=$(((length+width)*2))

topic="Chu vi"

;;

#################################################
# Đếm hình tam giác
#################################################

8)

num=$((RANDOM%15+1))

prompt="Có ${num} hình tam giác. Hỏi có tất cả bao nhiêu cạnh?"

ans=$((num*3))

topic="Đếm cạnh"

;;

#################################################
# Đếm hình vuông
#################################################

9)

num=$((RANDOM%15+1))

prompt="Có ${num} hình vuông. Hỏi có tất cả bao nhiêu góc?"

ans=$((num*4))

topic="Đếm góc"

;;

esac

echo "  { prompt: '$prompt', answer: $ans, topic: '$topic' }," >> "$outfile"

((count++))

done

echo "];" >> "$outfile"

}


#########################################################
# MAIN
#########################################################

echo "Generating Level 1..."
generate_level1

echo "Generating Level 2..."
generate_level2

echo "Generating Level 3..."
generate_level3

echo "Generating Level 4..."
generate_level4

echo "Generating Level 5..."
generate_level5

echo "Generating Level 6..."
generate_level6

echo ""
echo "Done!"
echo ""

ls questions