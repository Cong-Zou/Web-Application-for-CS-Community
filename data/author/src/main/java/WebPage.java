import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.safari.SafariDriver;

public class WebPage {

    private static final String AMINER_PROFILE_PREFIX = "https://aminer.org/profile/";

    public static String getEmailFromAMinerPage(String userId, String userName) {
        String profilePage =
                AMINER_PROFILE_PREFIX + Util.replaceSpaceWithDash(userName) + "/" + userId;
        String email = null;

        WebDriver driver = new SafariDriver();
        try {
            driver.get(profilePage);
            Thread.sleep(2000);

            // open log in window
            WebElement loginWindow = driver.findElement(By.xpath("//*[@id=\"profile_main\"]/div[1]/div/div/div[1]/div[1]/div[2]/ul/li[3]/div"));
            loginWindow.click();

            Thread.sleep(2000);
            // fill out log in form
            WebElement username = driver.findElement(By.xpath("//*[@id=\"login-form\"]/fieldset/section[1]/label[2]/input"));
            WebElement password = driver.findElement(By.xpath("//*[@id=\"login-form\"]/fieldset/section[2]/label[2]/input"));
            WebElement login = driver.findElement(By.xpath("//*[@id=\"login-form\"]/footer/button[1]"));

            username.sendKeys("aliciaxhqiu@gmail.com");
            password.sendKeys("cmu12345");
            login.click();

            Thread.sleep(1000);
            driver.navigate().refresh();
            Thread.sleep(3000);

            // find email image link
            WebElement image = driver.findElement(By.cssSelector("img.email-src-height"));
            email = image.getAttribute("src");

            driver.quit();

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to get email for " + userName);
            driver.quit();
        }
        return email;
    }
}
