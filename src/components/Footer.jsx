import copyrightSymbol from "../images/copyright-symbol.svg"

export default function Footer() {
    return (
        <footer>
            <div className="div1">
                <p>Binge Index</p>
                <img src={copyrightSymbol}></img>
                <p>2025</p>
            </div>
            <div className="div2">
                <p>Contact information:</p>
                <p>kylaknauber@gmail.com</p>
            </div>
        </footer>
    )
}