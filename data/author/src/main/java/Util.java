public class Util {
    public static boolean matchesAuthorName(String nameStr, String authorName) {
        if (nameStr == null || authorName == null) return false;

        String[] nameParts = authorName.split("\\s+");
        String firstName = nameParts[0].toLowerCase();
        String lastName = nameParts[nameParts.length - 1].toLowerCase();
        nameStr = nameStr.toLowerCase();

        if (!nameStr.contains(firstName) || !nameStr.contains(lastName)) {
            return false;
        }
        return true;
    }

    public static String replaceSpaceWithDash(String name) {
        name = name.toLowerCase().trim();
        return name.replaceAll("\\s+", "-");
    }
}
