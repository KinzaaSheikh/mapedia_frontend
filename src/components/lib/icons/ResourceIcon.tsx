import { Icon, IconProps } from '@chakra-ui/icons';

export const ResourceIcon = (
  props: Omit<IconProps, 'css'> // ts bug with emotion, checkout https://github.com/emotion-js/emotion/issues/1640
) => (
  <Icon viewBox="0 0 10000 10000" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd" {...props}>
    <g>
      <path
        fill="currentColor"
        fillRule="nonzero"
        d="M5116 4870l0 183 247 0c200,-123 321,-338 321,-573 0,-371 -300,-670 -671,-670 -370,0 -670,300 -670,670 0,234 120,450 320,573l245 0 0 -183 -207 -299c-77,-112 94,-230 171,-118l140 202 139 -202c78,-112 249,6 171,118l-206 299zm171 391l-547 0 0 228c183,0 363,0 547,0l0 -228zm-171 -1654c441,52 776,427 776,873 0,297 -149,572 -397,735l0 379c0,57 -47,104 -104,104l-275 0 1 1027c132,-148 327,-287 533,-289l1922 -14 0 -3697 -1922 0c-293,0 -533,240 -533,533l-1 349zm-208 2091l-272 0c-58,0 -105,-47 -105,-104l0 -379c-247,-163 -397,-438 -397,-735 0,-444 334,-820 774,-873l1 -346c0,-293 -235,-535 -529,-536l-1925 5 0 3692 1921 14c255,2 423,137 533,300l-1 -1038zm2872 -2540l671 0c57,0 104,47 104,105l0 4116c0,58 -47,104 -104,104 -2301,0 -4601,0 -6902,0 -57,0 -104,-46 -104,-104l0 -4116c0,-58 47,-105 104,-105l698 0 0 -532c0,-57 46,-104 104,-104 501,23 1550,41 2029,-5 261,1 501,140 633,363 134,-224 376,-363 637,-363l1930 0c34,0 67,0 104,6 54,4 96,49 96,103l0 532zm-5533 209l-593 0 0 3908 3243 0c-35,-179 -153,-628 -521,-631l-2026 -15c-57,0 -103,-46 -103,-103l0 -3159zm2871 3908l3228 0 0 -3908 -566 0 0 3159c0,57 -47,103 -104,103l-2025 15c-103,1 -243,71 -355,193 -92,99 -163,232 -178,390l0 48z"
      />
    </g>
  </Icon>
);
