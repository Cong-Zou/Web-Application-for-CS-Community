import java.util.List;
import java.util.Map;

public class Author {

    private static DBDriver dbDriver = new DBDriver();

    private String name;
    private String affiliation;
    private boolean hasAffiliation;
    private String title;
    private String photo;
    private String interests;
    private String email;
    private String homepage;

    static int authorCount = 0;
    static int affiliationUpdate = 0;
    static int titleUpdate = 0;
    static int emailUpdate = 0;
    static int interestsUpdate = 0;
    static int photoUpdate = 0;
    static int homepageUpdate = 0;

    public Author(String name, String affiliation, boolean hasAffiliation) {
        this.name = name;
        this.affiliation = affiliation;
        this.hasAffiliation = hasAffiliation;
    }

    public boolean hasAffiliation() {
        return this.hasAffiliation;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAffiliation() {
        return affiliation;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPhoto() {
        return photo;
    }

    public String getInterests() {
        return interests;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHomepage() {
        return homepage;
    }

    public static List<String[]> getAllAuthors() {
        return dbDriver.getPeople();
    }

    public void updateInfo(Map<String, String> attributes) {
        if (attributes == null) return;

        for (String attrName : attributes.keySet()) {
            switch (attrName) {
                case ("affiliation"):
                    if (this.affiliation == null) {
                        this.affiliation = attributes.get(attrName);
                    }
                    break;
                case ("title"):
                    if (this.title == null) {
                        this.title = attributes.get(attrName);
                    }
                    break;
                case ("email"):
                    if (this.email == null) {
                        this.email = attributes.get(attrName);
                    }
                    break;
                case ("interests"):
                    if (this.interests == null) {
                        this.interests = attributes.get(attrName);
                    }
                    break;
                case ("photo"):
                    if (this.photo == null) {
                        this.photo = attributes.get(attrName);
                    }
                    break;
                case ("homepage"):
                    if (this.homepage == null) {
                        this.homepage = attributes.get(attrName);
                    }
                    break;
                default:
            }
        }
    }

    public void updateInDB() {
        System.out.println("Updating " + this.name + "...");
        authorCount++;
        StringBuilder updateCommand = new StringBuilder();

        updateCommand.append(String.format("MATCH (a {name: \'%s\'}) SET ", this.name));
        int commandSize = updateCommand.length();

        if (!this.hasAffiliation && this.affiliation != null) {
            updateCommand.append(String.format("a.affiliation = \'%s\', ", this.affiliation));
            affiliationUpdate++;
        }

        if (this.title != null) {
            updateCommand.append(String.format("a.title = \'%s\', ", this.title));
            titleUpdate++;
        }

        if (this.email != null) {
            updateCommand.append(String.format("a.email = \'%s\', ", this.email));
            emailUpdate++;
        }

        if (this.interests != null) {
            updateCommand.append(String.format("a.interests = \'%s\', ", this.interests));
            interestsUpdate++;
        }

        if (this.photo != null) {
            updateCommand.append(String.format("a.photo = \'%s\', ", this.photo));
            photoUpdate++;
        }

        if (this.homepage != null) {
            updateCommand.append(String.format("a.homepage = \'%s\', ", this.homepage));
            homepageUpdate++;
        }

        if (commandSize == updateCommand.length()) {
            System.out.println("Nothing to update for " + this.name + "\n");
            return;
        }

        updateCommand.delete(updateCommand.length() - 2, updateCommand.length());
        dbDriver.execute(updateCommand.toString());

        System.out.println(updateCommand.toString());
        System.out.println("Update completed for " + this.name + "\n");
    }
}
