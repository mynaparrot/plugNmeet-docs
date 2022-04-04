import React from 'react';
import Link from "@docusaurus/Link";
// import Logo from "../../static/img/plugNmeet-logo.png"

const HeroBanner = () => {
    return (
        <div className='landing-banner'>
            <div className="container">
                {/* <div className="logo">
                    <img src={Logo} alt="plugNmeet" />
                </div> */}
                <p>Scalable, High Performance, Open source web conferencing system</p>
                <Link
                    className="button button--secondary button--lg"
                    to="/docs/intro"
                >
                    Get Started
                </Link>
            </div>
        </div>
    );
}

export default HeroBanner;
