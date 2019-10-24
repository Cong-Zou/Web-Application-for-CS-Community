import sys
import scholarly

print(next(scholarly.search_author(sys.argv[1])))