export default function ThousandSeparator(x) {

    if (x || x == 0)
        return x
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else {
        return null;
    }

}
