function Footer(){
  var date = new Date();
    return(
        <footer>
        <div class="footer-container">
          <div>
            <h6>Campus A</h6>
            <div>New Boys</div>
            <div>Dmart Side</div>
            <div>Mumbai</div>
  
          </div>
          <div>
            <h6>Campus B</h6>
            <div>New Girls</div>
            <div>FRK</div>
            <div>chembur</div>
          </div>
        </div>
        <p>© {date.getFullYear()} All Rights Reserved SAKEC College</p>
      </footer>
    );
}

export default Footer;