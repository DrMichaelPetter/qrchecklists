#!/bin/bash
# test data from http://www.randat.com/

base="teilnehmer"
mdfilename="$base".md
input="$base".csv

rm -f $mdfilename
rm -f *.png
ls *.svg | grep -xv "logo.svg" | xargs rm

cat <<EOT >> $mdfilename
| # | pre | last | Hof | QR Code | Mini QR Code |
|---|---|---|---|---|---|
EOT


# create QR codes, containing FA25;#id;Vorname;Nachname
csvcut "$input" | tail -n +2 | nl -w 1 -s"," | awk  -F, '{ print "\"FA2025;"$4";"$2";"$3"\" -o " $1 ".svg" }' | xargs -n 3  qrencode -m 1 -l Q -t SVG -s 16
csvcut "$input" | tail -n +2 | nl -w 1 -s"," | awk  -F, '{ print "\"FA2025;"$4"\" -o " $1 "-mini.svg" }' | xargs -n 3  qrencode -m 1 -l L -t SVG -s 16
rsvg-convert -h 100 -f png -o logo.png logo.svg
for i in *.svg; do
    outfile=${i/.svg/.png}
    if [[ $i == *-mini.svg ]]; then
        rsvg-convert -h 250 -f png $i -o $outfile
        continue
    fi
    rsvg-convert -h 250 -f png $i -o $outfile
    composite  -gravity center -background white logo.png $outfile $outfile
done
csvcut "$input" | tail -n +2 | nl -w 1 -s"," | awk  -F, '{ print "|",$1,"|",$2,"|", $3,"|", $5,"|", "![" $1 "](" $1 ".png \"" $1"\")|", "![" $1 "](" $1 "-mini.png \"" $1"\")|"}' >> $mdfilename
markdown $mdfilename > "$base".html