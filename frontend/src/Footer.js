import React from 'react';
import "./style.css";

class Footer extends React.Component {
    render() {
        return (
            <footer id="footer" class="bd-footer py-1 bg-light text-muted text-center" style={{backgroundColor: "#e3e3e3"}}>
                <p class="pt-3">Author: wong tak kai</p>
                <p>Time: 2023</p>
                <p class="pb-3"><a href="email:takawong@example.com">takawong@example.com</a></p>
            </footer>
        );
    }
}

export default Footer;